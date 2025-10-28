import { randomUUID } from "crypto";
import { Entity, ManyToOne, PrimaryKey, Property, ref, Ref, UuidType } from "@mikro-orm/postgresql";
import { User } from "src/user/user.entity";

@Entity()
export class Stat {
  @PrimaryKey({ type: UuidType })
  public id: string = randomUUID();

  @ManyToOne(() => User, { ref: true })
  public user: Ref<User>;

  @Property({ type: "int" })
  public timeSeen: number;

  @Property({ type: "int" })
  public pagesRead: number;

  public constructor(parameters: { timeSeen: number; pagesRead: number; user: User }) {
    this.pagesRead = parameters.pagesRead;
    this.timeSeen = parameters.timeSeen;
    this.user = ref(parameters.user);
  }
}
