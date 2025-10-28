import { HttpStatus, Injectable } from "@nestjs/common";
import { MikroORM } from "@mikro-orm/postgresql";
import { TsRestException } from "@ts-rest/nest";
import { FilterDto, ListResult, UpdateUserDto, userContract, UserDto } from "@biblio-cine/source";
import { UserMapper } from "./user.mapper";
import { User } from "./user.entity";

@Injectable()
export class UserService {
  private readonly orm: MikroORM;

  private readonly mapper: UserMapper;
  constructor(orm: MikroORM, mapper: UserMapper) {
    this.orm = orm;
    this.mapper = mapper;
  }

  public async get(username: string): Promise<UserDto> {
    const em = this.orm.em.fork();
    const repository = em.getRepository(User);
    const entity = await repository.findOne({ username });
    if (!entity) {
      throw new TsRestException(userContract.get, {
        status: 404,

        body: {
          error: "UserNotFound",
          message: `User with username ${username} not found`,
        },
      });
    }
    return this.mapper.entityToDto(entity);
  }
  public async getAll(filter: FilterDto): Promise<ListResult<UserDto>> {
    const em = this.orm.em.fork();
    let limit: number | undefined = undefined;
    let offset: number | undefined = undefined;
    const disablePagination = filter.disablePagination ?? false;
    if (!disablePagination) {
      limit = filter.itemsPerPage ?? 20;

      offset = ((filter.page ?? 1) - 1) * limit;
    }
    const orderBy = filter.orderBy ?? {
      eventDate: "DESC",
    };
    let qb = em.qb(User);
    if (filter.search !== undefined) {
      qb = qb.andWhere({ title: { $like: `%${filter.search}%` } });
    }
    const [entities, total] = await qb
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .getResultAndCount();
    return {
      data: this.mapper.entitiesToDtos(entities),
      total,
    };
  }

  public async update(id: string, updateDto: UpdateUserDto): Promise<UserDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(User);
      const existingEntity = await repository.findOne({
        id,
      });
      if (!existingEntity) {
        throw new TsRestException(userContract.update, {
          status: 404,
          body: {
            error: "UserNotFound",
            message: `User with id ${id} not found`,
          },
        });
      }
      const item = await this.mapper.updateDtoToEntity(id, updateDto, em);
      await em.persistAndFlush(item);
      await em.commit();
      return this.mapper.entityToDto(item);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(userContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "User update failed",
            },
          })
        : new TsRestException(userContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "User update failed",
            },
          });
    }
  }
}
