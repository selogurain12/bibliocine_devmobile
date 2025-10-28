import { randomUUID } from "crypto";
import { Entity, ManyToOne, PrimaryKey, Property, ref, Ref, UuidType } from "@mikro-orm/postgresql";
import { User } from "src/user/user.entity";

@Entity()
export class FinishedMovie {
  @PrimaryKey({ type: UuidType })
  public id: string = randomUUID();

  @Property({ type: "varchar" })
  public movieId: string;

  @ManyToOne(() => User, { ref: true })
  public user: Ref<User>;

  public constructor(parameters: { movieId: string; user: User }) {
    this.movieId = parameters.movieId;
    this.user = ref(parameters.user);
  }
}
