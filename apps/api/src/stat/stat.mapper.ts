import { HttpException, Injectable } from "@nestjs/common";
import { CreateStatDto, StatDto, UpdateStatDto } from "@biblio-cine/source";
import { UserMapper } from "src/user/user.mapper";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { User } from "src/user/user.entity";
import { Stat } from "./stat.entity";

@Injectable()
export class StatMapper {
  private readonly userMapper: UserMapper;

  public constructor(userMapper: UserMapper) {
    this.userMapper = userMapper;
  }

  public async entityToDto(entity: Stat, userId: string, em: EntityManager): Promise<StatDto> {
    const user = await em.getRepository(User).findOne({ id: { $eq: userId } });
    if (!user) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }
    return {
      id: entity.id,
      pagesRead: entity.pagesRead,
      timeSeen: entity.timeSeen,
      user: this.userMapper.entityToDto(user),
    };
  }

  public async entitiesToDtos(
    entities: Stat[],
    userId: string,
    em: EntityManager
  ): Promise<StatDto[]> {
    return Promise.all(entities.map(async (entity) => this.entityToDto(entity, userId, em)));
  }

  public async createDtoToEntity(
    dto: CreateStatDto,
    userId: string,
    em: EntityManager
  ): Promise<Stat> {
    const userEntity = await em.getRepository(User).findOne({ id: { $eq: userId } });
    if (!userEntity) {
      throw new HttpException("No user found", 404);
    }
    return new Stat({
      timeSeen: dto.timeSeen,
      pagesRead: dto.pagesRead,
      user: userEntity,
    });
  }

  public async updateDtoToEntity(
    id: string,
    dto: UpdateStatDto,
    userId: string,
    em: EntityManager
  ): Promise<Stat> {
    const entity = await em.getRepository(Stat).findOne({
      id,
      user: { id: userId },
    });
    if (!entity) {
      throw new HttpException("No user found", 404);
    }
    return em.assign(entity, {
      timeSeen: (entity.timeSeen += dto.timeSeen ?? 0),
      pagesRead: (entity.pagesRead += dto.pagesRead ?? 0),
    });
  }
}
