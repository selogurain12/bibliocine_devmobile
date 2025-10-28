import { HttpException, Injectable } from "@nestjs/common";
import { CreateFilmothequeDto, FilmothequeDto, UpdateFilmothequeDto } from "@biblio-cine/source";
import { UserMapper } from "src/user/user.mapper";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { User } from "src/user/user.entity";
import { Filmotheque } from "./filmotheque.entity";

@Injectable()
export class FilmothequeMapper {
  private readonly userMapper: UserMapper;

  public constructor(userMapper: UserMapper) {
    this.userMapper = userMapper;
  }
  public async entityToDto(entity: Filmotheque, em: EntityManager): Promise<FilmothequeDto> {
    const users = await em.getRepository(User).find({ $and: [{ id: entity.id }] });
    return {
      id: entity.id,
      name: entity.name,
      movies: entity.movies,
      users: this.userMapper.entitiesToDtos(users),
    };
  }

  public async entitiesToDtos(
    entities: Filmotheque[],
    em: EntityManager
  ): Promise<FilmothequeDto[]> {
    return Promise.all(entities.map(async (entity) => this.entityToDto(entity, em)));
  }

  public async createDtoToEntity(
    dto: CreateFilmothequeDto,
    userId: string,
    em: EntityManager
  ): Promise<Filmotheque> {
    const usersEntity = await em.getRepository(User).findOne({ id: { $eq: userId } });
    if (!usersEntity) {
      throw new HttpException("No user found", 404);
    }
    const result = new Filmotheque({
      name: dto.name,
      movies: dto.movies,
    });
    result.users.add(usersEntity);
    return result;
  }

  public async updateDtoToEntity(
    filmothequeId: string,
    dto: UpdateFilmothequeDto,
    em: EntityManager
  ): Promise<Filmotheque> {
    const entity = await em.getRepository(Filmotheque).findOne({ id: { $eq: filmothequeId } });
    if (!entity) {
      throw new NotFoundError(`Filmotheque with id ${filmothequeId} not found`);
    }
    let userEntities: User[] = [];
    if (dto.users) {
      userEntities = await em.getRepository(User).find({
        $and: [{ id: { $in: dto.users.map((user) => user.id) } }],
      });
      if (userEntities.length === 0) {
        throw new HttpException("No user found", 404);
      }
    }
    await entity.users.init();
    entity.users.removeAll();
    em.assign(entity, {
      name: dto.name,
      movies: dto.movies,
    });
    entity.users.add(userEntities);
    return entity;
  }
}
