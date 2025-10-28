import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import {
  CreateFilmothequeDto,
  filmothequeContract,
  FilmothequeDto,
  ListResult,
  UpdateFilmothequeDto,
} from "@biblio-cine/source";
import { TsRestException } from "@ts-rest/nest";
import { FilmothequeMapper } from "./filmotheque.mapper";
import { Filmotheque } from "./filmotheque.entity";

@Injectable()
export class FilmothequeService {
  private readonly orm: MikroORM;

  private readonly filmothequeMapper: FilmothequeMapper;

  public constructor(orm: MikroORM, filmothequeMapper: FilmothequeMapper) {
    this.orm = orm;
    this.filmothequeMapper = filmothequeMapper;
  }

  public async get(id: string, userId: string): Promise<FilmothequeDto> {
    const em = this.orm.em.fork();
    const repository = em.getRepository(Filmotheque);
    const entity = await repository.findOne({ id, users: { id: userId } }, { populate: ["users"] });
    if (!entity) {
      throw new TsRestException(filmothequeContract.getFilmotheque, {
        status: 404,

        body: {
          error: "FilmothequeNotFound",
          message: `Filmotheque with id ${id} not found`,
        },
      });
    }
    return this.filmothequeMapper.entityToDto(entity, em);
  }

  public async getAll(userId: string): Promise<ListResult<FilmothequeDto>> {
    const em = this.orm.em.fork();
    const qb = em.qb(Filmotheque).where({ users: { id: userId } });
    const [entities, total] = await qb.getResultAndCount();
    await em.populate(entities, ["users"]);
    return {
      data: await this.filmothequeMapper.entitiesToDtos(entities, em),
      total,
    };
  }

  public async create(parameters: CreateFilmothequeDto, userId: string): Promise<FilmothequeDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(Filmotheque);
      const existingUser = await repository.findOne({ id: userId });
      if (!existingUser) {
        throw new TsRestException(filmothequeContract.createFilmotheque, {
          status: 404,
          body: {
            error: "UserNotFound",
            message: `User with id ${userId} not found`,
          },
        });
      }
      const item = await this.filmothequeMapper.createDtoToEntity(parameters, userId, em);
      await em.persistAndFlush(item);
      await em.commit();
      await em.populate(item, ["users"]);
      return await this.filmothequeMapper.entityToDto(item, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(filmothequeContract.createFilmotheque, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "Filmotheque creation failed",
            },
          })
        : new TsRestException(filmothequeContract.createFilmotheque, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "Filmotheque creation failed",
            },
          });
    }
  }

  public async update(
    id: string,
    updateDto: UpdateFilmothequeDto,
    userId: string
  ): Promise<FilmothequeDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(Filmotheque);
      const existingEntity = await repository.findOne({
        id,
        users: { id: userId },
      });
      if (!existingEntity) {
        throw new TsRestException(filmothequeContract.updateFilmotheque, {
          status: 404,
          body: {
            error: "FilmothequeNotFound",
            message: `Filmotheque with id ${id} not found`,
          },
        });
      }
      const item = await this.filmothequeMapper.updateDtoToEntity(id, updateDto, em);
      await em.persistAndFlush(item);
      await em.commit();
      await em.populate(item, ["users"]);
      return await this.filmothequeMapper.entityToDto(item, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(filmothequeContract.updateFilmotheque, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "Filmotheque update failed",
            },
          })
        : new TsRestException(filmothequeContract.updateFilmotheque, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "Filmotheque update failed",
            },
          });
    }
  }

  public async delete(id: string, userId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(Filmotheque);
      const entity = await repository.findOne({
        $and: [{ id }, { users: { id: userId } }],
      });
      if (!entity) {
        throw new TsRestException(filmothequeContract.deleteFilmotheque, {
          status: 404,
          body: {
            error: "FilmothequeNotFound",
            message: `Filmotheque with id ${id} not found`,
          },
        });
      }
      await em.removeAndFlush(entity);
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(filmothequeContract.deleteFilmotheque, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "Filmotheque deletion failed",
            },
          })
        : new TsRestException(filmothequeContract.deleteFilmotheque, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "Filmotheque deletion failed",
            },
          });
    }
  }
}
