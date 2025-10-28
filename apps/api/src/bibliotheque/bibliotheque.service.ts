import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import {
  CreateBibliothequeDto,
  bibliothequeContract,
  BibliothequeDto,
  ListResult,
  UpdateBibliothequeDto,
} from "@biblio-cine/source";
import { TsRestException } from "@ts-rest/nest";
import { BibliothequeMapper } from "./bibliotheque.mapper";
import { Bibliotheque } from "./bibliotheque.entity";

@Injectable()
export class BibliothequeService {
  private readonly orm: MikroORM;

  private readonly bibliothequeMapper: BibliothequeMapper;

  public constructor(orm: MikroORM, bibliothequeMapper: BibliothequeMapper) {
    this.orm = orm;
    this.bibliothequeMapper = bibliothequeMapper;
  }

  public async get(id: string, userId: string): Promise<BibliothequeDto> {
    const em = this.orm.em.fork();
    const repository = em.getRepository(Bibliotheque);
    const entity = await repository.findOne({ id, users: { id: userId } }, { populate: ["users"] });
    if (!entity) {
      throw new TsRestException(bibliothequeContract.getBibliotheque, {
        status: 404,

        body: {
          error: "BibliothequeNotFound",
          message: `Bibliotheque with id ${id} not found`,
        },
      });
    }
    return this.bibliothequeMapper.entityToDto(entity, em);
  }

  public async getAll(userId: string): Promise<ListResult<BibliothequeDto>> {
    const em = this.orm.em.fork();
    const qb = em.qb(Bibliotheque).where({ users: { id: userId } });
    const [entities, total] = await qb.getResultAndCount();
    await em.populate(entities, ["users"]);
    return {
      data: await this.bibliothequeMapper.entitiesToDtos(entities, em),
      total,
    };
  }

  public async create(parameters: CreateBibliothequeDto, userId: string): Promise<BibliothequeDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(Bibliotheque);
      const existingUser = await repository.findOne({ id: userId });
      if (!existingUser) {
        throw new TsRestException(bibliothequeContract.createBibliotheque, {
          status: 404,
          body: {
            error: "UserNotFound",
            message: `User with id ${userId} not found`,
          },
        });
      }
      const item = await this.bibliothequeMapper.createDtoToEntity(parameters, userId, em);
      await em.persistAndFlush(item);
      await em.commit();
      await em.populate(item, ["users"]);
      return await this.bibliothequeMapper.entityToDto(item, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(bibliothequeContract.createBibliotheque, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "Bibliotheque creation failed",
            },
          })
        : new TsRestException(bibliothequeContract.createBibliotheque, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "Bibliotheque creation failed",
            },
          });
    }
  }

  public async update(
    id: string,
    updateDto: UpdateBibliothequeDto,
    userId: string
  ): Promise<BibliothequeDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(Bibliotheque);
      const existingEntity = await repository.findOne({
        id,
        users: { id: userId },
      });
      if (!existingEntity) {
        throw new TsRestException(bibliothequeContract.updateBibliotheque, {
          status: 404,
          body: {
            error: "BibliothequeNotFound",
            message: `Bibliotheque with id ${id} not found`,
          },
        });
      }
      const item = await this.bibliothequeMapper.updateDtoToEntity(id, updateDto, em);
      await em.persistAndFlush(item);
      await em.commit();
      await em.populate(item, ["users"]);
      return await this.bibliothequeMapper.entityToDto(item, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(bibliothequeContract.updateBibliotheque, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "Bibliotheque update failed",
            },
          })
        : new TsRestException(bibliothequeContract.updateBibliotheque, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "Bibliotheque update failed",
            },
          });
    }
  }

  public async delete(id: string, userId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(Bibliotheque);
      const entity = await repository.findOne({
        $and: [{ id }, { users: { id: userId } }],
      });
      if (!entity) {
        throw new TsRestException(bibliothequeContract.deleteBibliotheque, {
          status: 404,
          body: {
            error: "BibliothequeNotFound",
            message: `Bibliotheque with id ${id} not found`,
          },
        });
      }
      await em.removeAndFlush(entity);
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(bibliothequeContract.deleteBibliotheque, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "Bibliotheque deletion failed",
            },
          })
        : new TsRestException(bibliothequeContract.deleteBibliotheque, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "Bibliotheque deletion failed",
            },
          });
    }
  }
}
