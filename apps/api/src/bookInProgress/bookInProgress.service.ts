import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import {
  CreateBookInProgressDto,
  bookInProgressContract,
  BookInProgressDto,
  ListResult,
  UpdateBookInProgressDto,
} from "@biblio-cine/source";
import { TsRestException } from "@ts-rest/nest";
import { BookInProgressMapper } from "./bookInProgress.mapper";
import { BookInProgress } from "./bookInProgress.entity";

@Injectable()
export class BookInProgressService {
  private readonly orm: MikroORM;

  private readonly bookInProgressMapper: BookInProgressMapper;

  public constructor(orm: MikroORM, bookInProgressMapper: BookInProgressMapper) {
    this.orm = orm;
    this.bookInProgressMapper = bookInProgressMapper;
  }

  public async get(id: string, userId: string): Promise<BookInProgressDto> {
    const em = this.orm.em.fork();
    const repository = em.getRepository(BookInProgress);
    const entity = await repository.findOne({ id, user: { id: userId } }, { populate: ["user"] });
    if (!entity) {
      throw new TsRestException(bookInProgressContract.getBookInProgress, {
        status: 404,

        body: {
          error: "BookInProgressNotFound",
          message: `BookInProgress with id ${id} not found`,
        },
      });
    }
    return this.bookInProgressMapper.entityToDto(entity, userId, em);
  }

  public async getAll(userId: string): Promise<ListResult<BookInProgressDto>> {
    const em = this.orm.em.fork();
    const qb = em.qb(BookInProgress).where({ users: { id: userId } });
    const [entities, total] = await qb.getResultAndCount();
    await em.populate(entities, ["user"]);
    return {
      data: await this.bookInProgressMapper.entitiesToDtos(entities, userId, em),
      total,
    };
  }

  public async create(
    parameters: CreateBookInProgressDto,
    userId: string
  ): Promise<BookInProgressDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(BookInProgress);
      const existingUser = await repository.findOne({ id: userId });
      if (!existingUser) {
        throw new TsRestException(bookInProgressContract.createBookInProgress, {
          status: 404,
          body: {
            error: "UserNotFound",
            message: `User with id ${userId} not found`,
          },
        });
      }
      const item = await this.bookInProgressMapper.createDtoToEntity(parameters, userId, em);
      await em.persistAndFlush(item);
      await em.commit();
      await em.populate(item, ["user"]);
      return await this.bookInProgressMapper.entityToDto(item, userId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(bookInProgressContract.createBookInProgress, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "BookInProgress creation failed",
            },
          })
        : new TsRestException(bookInProgressContract.createBookInProgress, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "BookInProgress creation failed",
            },
          });
    }
  }

  public async update(
    id: string,
    updateDto: UpdateBookInProgressDto,
    userId: string
  ): Promise<BookInProgressDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(BookInProgress);
      const existingEntity = await repository.findOne({
        id,
        user: { id: userId },
      });
      if (!existingEntity) {
        throw new TsRestException(bookInProgressContract.updateBookInProgress, {
          status: 404,
          body: {
            error: "BookInProgressNotFound",
            message: `BookInProgress with id ${id} not found`,
          },
        });
      }
      const item = await this.bookInProgressMapper.updateDtoToEntity(id, updateDto, userId, em);
      await em.persistAndFlush(item);
      await em.commit();
      await em.populate(item, ["user"]);
      return await this.bookInProgressMapper.entityToDto(item, userId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(bookInProgressContract.updateBookInProgress, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "BookInProgress update failed",
            },
          })
        : new TsRestException(bookInProgressContract.updateBookInProgress, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "BookInProgress update failed",
            },
          });
    }
  }

  public async delete(id: string, userId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(BookInProgress);
      const entity = await repository.findOne({
        $and: [{ id }, { user: { id: userId } }],
      });
      if (!entity) {
        throw new TsRestException(bookInProgressContract.deleteBookInProgress, {
          status: 404,
          body: {
            error: "BookInProgressNotFound",
            message: `BookInProgress with id ${id} not found`,
          },
        });
      }
      await em.removeAndFlush(entity);
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(bookInProgressContract.deleteBookInProgress, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "BookInProgress deletion failed",
            },
          })
        : new TsRestException(bookInProgressContract.deleteBookInProgress, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "BookInProgress deletion failed",
            },
          });
    }
  }
}
