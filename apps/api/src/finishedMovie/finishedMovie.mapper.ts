import { CreateFinishedMovieDto, FinishedMovieDto } from "@biblio-cine/source";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { HttpException, Injectable } from "@nestjs/common";
import { User } from "src/user/user.entity";
import { UserMapper } from "src/user/user.mapper";
import { FinishedMovie } from "./finishedMovie.entity";

@Injectable()
export class FinishedMovieMapper {
  private readonly userMapper: UserMapper;

  public constructor(userMapper: UserMapper) {
    this.userMapper = userMapper;
  }
  public async entityToDto(
    entity: FinishedMovie,
    userId: string,
    em: EntityManager
  ): Promise<FinishedMovieDto> {
    const user = await em.getRepository(User).findOne({ id: { $eq: userId } });
    if (!user) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }
    return {
      id: entity.id,
      movieId: entity.movieId,
      user: this.userMapper.entityToDto(user),
    };
  }

  public async entitiesToDtos(
    entities: FinishedMovie[],
    userId: string,
    em: EntityManager
  ): Promise<FinishedMovieDto[]> {
    return Promise.all(entities.map(async (entity) => this.entityToDto(entity, userId, em)));
  }

  public async createDtoToEntity(
    dto: CreateFinishedMovieDto,
    userId: string,
    em: EntityManager
  ): Promise<FinishedMovie> {
    const userEntity = await em.getRepository(User).findOne({ id: { $eq: userId } });
    if (!userEntity) {
      throw new HttpException("No user found", 404);
    }
    return new FinishedMovie({
      movieId: dto.movieId,
      user: userEntity,
    });
  }
}
