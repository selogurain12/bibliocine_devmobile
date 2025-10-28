import { Injectable } from "@nestjs/common";
import { UpdateUserDto, UserDto } from "@biblio-cine/source";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { User } from "./user.entity";

@Injectable()
export class UserMapper {
  public entityToDto(entity: User): UserDto {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      username: entity.username,
      avatarUrl: entity.avatarUrl,
    };
  }

  public entitiesToDtos(entities: User[]): UserDto[] {
    return entities.map((entity) => this.entityToDto(entity));
  }

  public async updateDtoToEntity(id: string, dto: UpdateUserDto, em: EntityManager): Promise<User> {
    const entity = await em.getRepository(User).findOne({ id: { $eq: id } });
    if (!entity) {
      throw new NotFoundError(`User with id ${id} not found`);
    }
    em.assign(entity, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      username: dto.username,
      avatarUrl: dto.avatarUrl,
    });
    return entity;
  }
}
