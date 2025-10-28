import { HttpException, Injectable } from "@nestjs/common";
import { UserMapper } from "src/user/user.mapper";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { CreateFriendlistDto, FriendlistDto, UpdateFriendlistDto } from "@biblio-cine/source";
import { User } from "src/user/user.entity";
import { Friendlist } from "./friendlist.entity";

@Injectable()
export class FriendlistMapper {
  private readonly userMapper: UserMapper;

  public constructor(userMapper: UserMapper) {
    this.userMapper = userMapper;
  }
  public async entityToDto(
    entity: Friendlist,
    userId: string,
    em: EntityManager
  ): Promise<FriendlistDto> {
    const user = await em.getRepository(User).findOne({ id: { $eq: userId } });
    if (!user) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }
    const friends = await em
      .getRepository(User)
      .find({ $and: [{ id: { $in: entity.friends.map((user) => user.id) } }] });
    return {
      id: entity.id,
      user: this.userMapper.entityToDto(user),
      friends: this.userMapper.entitiesToDtos(friends),
    };
  }

  public async entitiesToDtos(
    entities: Friendlist[],
    userId: string,
    em: EntityManager
  ): Promise<FriendlistDto[]> {
    return Promise.all(entities.map(async (entity) => this.entityToDto(entity, userId, em)));
  }

  public async createDtoToEntity(
    dto: CreateFriendlistDto,
    userId: string,
    em: EntityManager
  ): Promise<Friendlist> {
    const userEntity = await em.getRepository(User).findOne({ id: { $eq: userId } });
    if (!userEntity) {
      throw new HttpException("No user found", 404);
    }
    const friendsEntity = await em
      .getRepository(User)
      .findOne({ $and: [{ id: { $in: dto.friends.map((user) => user.id) } }] });
    if (!friendsEntity) {
      throw new HttpException("No user found", 404);
    }
    const result = new Friendlist({
      user: userEntity,
    });
    result.friends.add(friendsEntity);
    return result;
  }

  public async updateDtoToEntity(
    friendlistId: string,
    dto: UpdateFriendlistDto,
    em: EntityManager
  ): Promise<Friendlist> {
    const entity = await em.getRepository(Friendlist).findOne({ id: { $eq: friendlistId } });
    if (!entity) {
      throw new NotFoundError(`Friendlist with id ${friendlistId} not found`);
    }
    let friendEntities: User[] = [];
    if (dto.friends) {
      friendEntities = await em.getRepository(User).find({
        $and: [{ id: { $in: dto.friends.map((user) => user.id) } }],
      });
      if (friendEntities.length === 0) {
        throw new HttpException("No user found", 404);
      }
    }
    await entity.friends.init();
    entity.friends.removeAll();
    entity.friends.add(friendEntities);
    return entity;
  }
}
