import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import {
  CreateFinishedBookDto,
  finishedBookContract,
  FinishedBookDto,
  ListResult,
} from "@biblio-cine/source";
import { TsRestException } from "@ts-rest/nest";
import { FinishedBookMapper } from "./finishedBook.mapper";
import { FinishedBook } from "./finishedBook.entity";

@Injectable()
export class FinishedBookService {
  private readonly orm: MikroORM;

  private readonly finishedBookMapper: FinishedBookMapper;

  public constructor(orm: MikroORM, finishedBookMapper: FinishedBookMapper) {
    this.orm = orm;
    this.finishedBookMapper = finishedBookMapper;
  }

  public async get(id: string, userId: string): Promise<FinishedBookDto> {
    const em = this.orm.em.fork();
    const repository = em.getRepository(FinishedBook);
    const entity = await repository.findOne({ id, user: { id: userId } }, { populate: ["user"] });
    if (!entity) {
      throw new TsRestException(finishedBookContract.getFinishedBook, {
        status: 404,

        body: {
          error: "FinishedBookNotFound",
          message: `FinishedBook with id ${id} not found`,
        },
      });
    }
    return this.finishedBookMapper.entityToDto(entity, userId, em);
  }

  public async getAll(userId: string): Promise<ListResult<FinishedBookDto>> {
    const em = this.orm.em.fork();
    const qb = em.qb(FinishedBook).where({ users: { id: userId } });
    const [entities, total] = await qb.getResultAndCount();
    await em.populate(entities, ["user"]);
    return {
      data: await this.finishedBookMapper.entitiesToDtos(entities, userId, em),
      total,
    };
  }

  public async create(parameters: CreateFinishedBookDto, userId: string): Promise<FinishedBookDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(FinishedBook);
      const existingUser = await repository.findOne({ id: userId });
      if (!existingUser) {
        throw new TsRestException(finishedBookContract.createFinishedBook, {
          status: 404,
          body: {
            error: "UserNotFound",
            message: `User with id ${userId} not found`,
          },
        });
      }
      const item = await this.finishedBookMapper.createDtoToEntity(parameters, userId, em);
      await em.persistAndFlush(item);
      await em.commit();
      await em.populate(item, ["user"]);
      return await this.finishedBookMapper.entityToDto(item, userId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(finishedBookContract.createFinishedBook, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "FinishedBook creation failed",
            },
          })
        : new TsRestException(finishedBookContract.createFinishedBook, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "FinishedBook creation failed",
            },
          });
    }
  }

  public async delete(id: string, userId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(FinishedBook);
      const entity = await repository.findOne({
        $and: [{ id }, { user: { id: userId } }],
      });
      if (!entity) {
        throw new TsRestException(finishedBookContract.deleteFinishedBook, {
          status: 404,
          body: {
            error: "FinishedBookNotFound",
            message: `FinishedBook with id ${id} not found`,
          },
        });
      }
      await em.removeAndFlush(entity);
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(finishedBookContract.deleteFinishedBook, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "FinishedBook deletion failed",
            },
          })
        : new TsRestException(finishedBookContract.deleteFinishedBook, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "FinishedBook deletion failed",
            },
          });
    }
  }
}
