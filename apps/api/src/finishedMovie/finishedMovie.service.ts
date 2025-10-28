import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import {
  CreateFinishedMovieDto,
  finishedMovieContract,
  FinishedMovieDto,
  ListResult,
} from "@biblio-cine/source";
import { TsRestException } from "@ts-rest/nest";
import { FinishedMovieMapper } from "./finishedMovie.mapper";
import { FinishedMovie } from "./finishedMovie.entity";

@Injectable()
export class FinishedMovieService {
  private readonly orm: MikroORM;

  private readonly finishedMovieMapper: FinishedMovieMapper;

  public constructor(orm: MikroORM, finishedMovieMapper: FinishedMovieMapper) {
    this.orm = orm;
    this.finishedMovieMapper = finishedMovieMapper;
  }

  public async get(id: string, userId: string): Promise<FinishedMovieDto> {
    const em = this.orm.em.fork();
    const repository = em.getRepository(FinishedMovie);
    const entity = await repository.findOne({ id, user: { id: userId } }, { populate: ["user"] });
    if (!entity) {
      throw new TsRestException(finishedMovieContract.getFinishedMovie, {
        status: 404,

        body: {
          error: "FinishedMovieNotFound",
          message: `FinishedMovie with id ${id} not found`,
        },
      });
    }
    return this.finishedMovieMapper.entityToDto(entity, userId, em);
  }

  public async getAll(userId: string): Promise<ListResult<FinishedMovieDto>> {
    const em = this.orm.em.fork();
    const qb = em.qb(FinishedMovie).where({ users: { id: userId } });
    const [entities, total] = await qb.getResultAndCount();
    await em.populate(entities, ["user"]);
    return {
      data: await this.finishedMovieMapper.entitiesToDtos(entities, userId, em),
      total,
    };
  }

  public async create(
    parameters: CreateFinishedMovieDto,
    userId: string
  ): Promise<FinishedMovieDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(FinishedMovie);
      const existingUser = await repository.findOne({ id: userId });
      if (!existingUser) {
        throw new TsRestException(finishedMovieContract.createFinishedMovie, {
          status: 404,
          body: {
            error: "UserNotFound",
            message: `User with id ${userId} not found`,
          },
        });
      }
      const item = await this.finishedMovieMapper.createDtoToEntity(parameters, userId, em);
      await em.persistAndFlush(item);
      await em.commit();
      await em.populate(item, ["user"]);
      return await this.finishedMovieMapper.entityToDto(item, userId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(finishedMovieContract.createFinishedMovie, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "FinishedMovie creation failed",
            },
          })
        : new TsRestException(finishedMovieContract.createFinishedMovie, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "FinishedMovie creation failed",
            },
          });
    }
  }

  public async delete(id: string, userId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(FinishedMovie);
      const entity = await repository.findOne({
        $and: [{ id }, { user: { id: userId } }],
      });
      if (!entity) {
        throw new TsRestException(finishedMovieContract.deleteFinishedMovie, {
          status: 404,
          body: {
            error: "FinishedMovieNotFound",
            message: `FinishedMovie with id ${id} not found`,
          },
        });
      }
      await em.removeAndFlush(entity);
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(finishedMovieContract.deleteFinishedMovie, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "FinishedMovie deletion failed",
            },
          })
        : new TsRestException(finishedMovieContract.deleteFinishedMovie, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "FinishedMovie deletion failed",
            },
          });
    }
  }
}
