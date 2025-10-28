import { HttpException, Injectable } from "@nestjs/common";
import { CreateBibliothequeDto, BibliothequeDto, UpdateBibliothequeDto } from "@biblio-cine/source";
import { UserMapper } from "src/user/user.mapper";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { User } from "src/user/user.entity";
import { Bibliotheque } from "./bibliotheque.entity";

@Injectable()
export class BibliothequeMapper {
  private readonly userMapper: UserMapper;

  public constructor(userMapper: UserMapper) {
    this.userMapper = userMapper;
  }
  public async entityToDto(entity: Bibliotheque, em: EntityManager): Promise<BibliothequeDto> {
    const users = await em
      .getRepository(User)
      .find({ $and: [{ id: { $in: entity.users.map((user) => user.id) } }] });
    return {
      id: entity.id,
      name: entity.name,
      books: entity.books,
      users: this.userMapper.entitiesToDtos(users),
    };
  }

  public async entitiesToDtos(
    entities: Bibliotheque[],
    em: EntityManager
  ): Promise<BibliothequeDto[]> {
    return Promise.all(entities.map(async (entity) => this.entityToDto(entity, em)));
  }

  public async createDtoToEntity(
    dto: CreateBibliothequeDto,
    userId: string,
    em: EntityManager
  ): Promise<Bibliotheque> {
    const usersEntity = await em.getRepository(User).findOne({ id: { $eq: userId } });
    if (!usersEntity) {
      throw new HttpException("No user found", 404);
    }
    const result = new Bibliotheque({
      name: dto.name,
      books: dto.books,
    });
    result.users.add(usersEntity);
    return result;
  }

  public async updateDtoToEntity(
    bibliothequeId: string,
    dto: UpdateBibliothequeDto,
    em: EntityManager
  ): Promise<Bibliotheque> {
    const entity = await em.getRepository(Bibliotheque).findOne({ id: { $eq: bibliothequeId } });
    if (!entity) {
      throw new NotFoundError(`Bibliotheque with id ${bibliothequeId} not found`);
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
      books: dto.books,
    });
    entity.users.add(userEntities);
    return entity;
  }
}
