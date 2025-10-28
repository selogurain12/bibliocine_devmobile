import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import {
  CreateMovieInProgressDto,
  movieInProgressContract,
  MovieInProgressDto,
  ListResult,
  UpdateMovieInProgressDto,
} from "@biblio-cine/source";
import { TsRestException } from "@ts-rest/nest";
import { MovieInProgressMapper } from "./movieInProgress.mapper";
import { MovieInProgress } from "./movieInProgress.entity";

@Injectable()
export class MovieInProgressService {
  private readonly orm: MikroORM;

  private readonly movieInProgressMapper: MovieInProgressMapper;

  public constructor(orm: MikroORM, movieInProgressMapper: MovieInProgressMapper) {
    this.orm = orm;
    this.movieInProgressMapper = movieInProgressMapper;
  }

  public async get(id: string, userId: string): Promise<MovieInProgressDto> {
    const em = this.orm.em.fork();
    const repository = em.getRepository(MovieInProgress);
    const entity = await repository.findOne({ id, user: { id: userId } }, { populate: ["user"] });
    if (!entity) {
      throw new TsRestException(movieInProgressContract.getMovieInProgress, {
        status: 404,

        body: {
          error: "MovieInProgressNotFound",
          message: `MovieInProgress with id ${id} not found`,
        },
      });
    }
    return this.movieInProgressMapper.entityToDto(entity, userId, em);
  }

  public async getAll(userId: string): Promise<ListResult<MovieInProgressDto>> {
    const em = this.orm.em.fork();
    const qb = em.qb(MovieInProgress).where({ users: { id: userId } });
    const [entities, total] = await qb.getResultAndCount();
    await em.populate(entities, ["user"]);
    return {
      data: await this.movieInProgressMapper.entitiesToDtos(entities, userId, em),
      total,
    };
  }

  public async create(
    parameters: CreateMovieInProgressDto,
    userId: string
  ): Promise<MovieInProgressDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(MovieInProgress);
      const existingUser = await repository.findOne({ id: userId });
      if (!existingUser) {
        throw new TsRestException(movieInProgressContract.createMovieInProgress, {
          status: 404,
          body: {
            error: "UserNotFound",
            message: `User with id ${userId} not found`,
          },
        });
      }
      const item = await this.movieInProgressMapper.createDtoToEntity(parameters, userId, em);
      await em.persistAndFlush(item);
      await em.commit();
      await em.populate(item, ["user"]);
      return await this.movieInProgressMapper.entityToDto(item, userId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(movieInProgressContract.createMovieInProgress, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "MovieInProgress creation failed",
            },
          })
        : new TsRestException(movieInProgressContract.createMovieInProgress, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "MovieInProgress creation failed",
            },
          });
    }
  }

  public async update(
    id: string,
    updateDto: UpdateMovieInProgressDto,
    userId: string
  ): Promise<MovieInProgressDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(MovieInProgress);
      const existingEntity = await repository.findOne({
        id,
        user: { id: userId },
      });
      if (!existingEntity) {
        throw new TsRestException(movieInProgressContract.updateMovieInProgress, {
          status: 404,
          body: {
            error: "MovieInProgressNotFound",
            message: `MovieInProgress with id ${id} not found`,
          },
        });
      }
      const item = await this.movieInProgressMapper.updateDtoToEntity(id, updateDto, userId, em);
      await em.persistAndFlush(item);
      await em.commit();
      await em.populate(item, ["user"]);
      return await this.movieInProgressMapper.entityToDto(item, userId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(movieInProgressContract.updateMovieInProgress, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "MovieInProgress update failed",
            },
          })
        : new TsRestException(movieInProgressContract.updateMovieInProgress, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "MovieInProgress update failed",
            },
          });
    }
  }

  public async delete(id: string, userId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(MovieInProgress);
      const entity = await repository.findOne({
        $and: [{ id }, { user: { id: userId } }],
      });
      if (!entity) {
        throw new TsRestException(movieInProgressContract.deleteMovieInProgress, {
          status: 404,
          body: {
            error: "MovieInProgressNotFound",
            message: `MovieInProgress with id ${id} not found`,
          },
        });
      }
      await em.removeAndFlush(entity);
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(movieInProgressContract.deleteMovieInProgress, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "MovieInProgress deletion failed",
            },
          })
        : new TsRestException(movieInProgressContract.deleteMovieInProgress, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "MovieInProgress deletion failed",
            },
          });
    }
  }
}
