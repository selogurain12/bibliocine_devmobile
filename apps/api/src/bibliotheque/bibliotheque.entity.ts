import { randomUUID } from "crypto";
import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
  UuidType,
} from "@mikro-orm/postgresql";
import { User } from "src/user/user.entity";

@Entity()
export class Bibliotheque {
  @PrimaryKey({ type: UuidType })
  public id: string = randomUUID();

  @Property({ type: "varchar" })
  public name: string;

  @Property({ type: "array" })
  public books: string[] | undefined;

  @ManyToMany(() => User, (user) => user.bibliotheques)
  public users = new Collection<User>(this);

  public constructor(parameters: { name: string; books: string[] | undefined }) {
    this.name = parameters.name;
    this.books = parameters.books;
  }
}
