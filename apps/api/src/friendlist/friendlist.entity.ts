import { randomUUID } from "crypto";
import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  ref,
  Ref,
  UuidType,
} from "@mikro-orm/postgresql";
import { User } from "src/user/user.entity";

@Entity()
export class Friendlist {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @ManyToOne(() => User, { ref: true })
  public user: Ref<User>;

  @ManyToMany(() => User, (user) => user.friendlists)
  public friends = new Collection<User>(this);

  public constructor(parameters: { user: User }) {
    this.user = ref(parameters.user);
  }
}
