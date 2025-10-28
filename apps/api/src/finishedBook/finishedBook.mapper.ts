import { CreateFinishedBookDto, FinishedBookDto } from "@biblio-cine/source";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { HttpException, Injectable } from "@nestjs/common";
import { User } from "src/user/user.entity";
import { UserMapper } from "src/user/user.mapper";
import { FinishedBook } from "./finishedBook.entity";

@Injectable()
export class FinishedBookMapper {
  private readonly userMapper: UserMapper;

  public constructor(userMapper: UserMapper) {
    this.userMapper = userMapper;
  }
  public async entityToDto(
    entity: FinishedBook,
    userId: string,
    em: EntityManager
  ): Promise<FinishedBookDto> {
    const user = await em.getRepository(User).findOne({ id: { $eq: userId } });
    if (!user) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }
    return {
      id: entity.id,
      bookId: entity.bookId,
      user: this.userMapper.entityToDto(user),
    };
  }

  public async entitiesToDtos(
    entities: FinishedBook[],
    userId: string,
    em: EntityManager
  ): Promise<FinishedBookDto[]> {
    return Promise.all(entities.map(async (entity) => this.entityToDto(entity, userId, em)));
  }

  public async createDtoToEntity(
    dto: CreateFinishedBookDto,
    userId: string,
    em: EntityManager
  ): Promise<FinishedBook> {
    const userEntity = await em.getRepository(User).findOne({ id: { $eq: userId } });
    if (!userEntity) {
      throw new HttpException("No user found", 404);
    }
    return new FinishedBook({
      bookId: dto.bookId,
      user: userEntity,
    });
  }
}
