import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { HttpException, Injectable } from "@nestjs/common";
import {
  MovieInProgressDto,
  CreateMovieInProgressDto,
  UpdateMovieInProgressDto,
} from "@biblio-cine/source";
import { User } from "src/user/user.entity";
import { UserMapper } from "src/user/user.mapper";
import { MovieInProgress } from "./movieInProgress.entity";

@Injectable()
export class MovieInProgressMapper {
  private readonly userMapper: UserMapper;

  public constructor(userMapper: UserMapper) {
    this.userMapper = userMapper;
  }
  public async entityToDto(
    entity: MovieInProgress,
    userId: string,
    em: EntityManager
  ): Promise<MovieInProgressDto> {
    const user = await em.getRepository(User).findOne({ id: { $eq: userId } });
    if (!user) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }
    return {
      id: entity.id,
      movieId: entity.movieId,
      viewingTime: entity.viewingTime,
      user: this.userMapper.entityToDto(user),
    };
  }

  public async entitiesToDtos(
    entities: MovieInProgress[],
    userId: string,
    em: EntityManager
  ): Promise<MovieInProgressDto[]> {
    return Promise.all(entities.map(async (entity) => this.entityToDto(entity, userId, em)));
  }

  public async createDtoToEntity(
    dto: CreateMovieInProgressDto,
    userId: string,
    em: EntityManager
  ): Promise<MovieInProgress> {
    const userEntity = await em.getRepository(User).findOne({ id: { $eq: userId } });
    if (!userEntity) {
      throw new HttpException("No user found", 404);
    }
    return new MovieInProgress({
      movieId: dto.movieId,
      viewingTime: dto.viewingTime,
      user: userEntity,
    });
  }

  public async updateDtoToEntity(
    id: string,
    dto: UpdateMovieInProgressDto,
    userId: string,
    em: EntityManager
  ): Promise<MovieInProgress> {
    const entity = await em.getRepository(MovieInProgress).findOne({
      id,
      user: { id: userId },
    });
    if (!entity) {
      throw new HttpException("No user found", 404);
    }
    return em.assign(entity, { viewingTime: dto.viewingTime });
  }
}
