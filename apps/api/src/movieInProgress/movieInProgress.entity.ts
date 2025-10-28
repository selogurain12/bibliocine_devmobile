import { randomUUID } from "crypto";
import { Entity, ManyToOne, PrimaryKey, Property, ref, Ref, UuidType } from "@mikro-orm/postgresql";
import { User } from "src/user/user.entity";

@Entity()
export class MovieInProgress {
  @PrimaryKey({ type: UuidType })
  public id: string = randomUUID();

  @Property({ type: "varchar" })
  public movieId: string;

  @Property({ type: "int" })
  public viewingTime: number;

  @ManyToOne(() => User, { ref: true })
  public user: Ref<User>;

  public constructor(parameters: { movieId: string; viewingTime: number; user: User }) {
    this.movieId = parameters.movieId;
    this.viewingTime = parameters.viewingTime;
    this.user = ref(parameters.user);
  }
}
