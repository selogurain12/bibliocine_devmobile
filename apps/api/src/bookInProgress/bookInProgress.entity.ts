import { randomUUID } from "crypto";
import { Entity, ManyToOne, PrimaryKey, Property, ref, Ref, UuidType } from "@mikro-orm/postgresql";
import { User } from "src/user/user.entity";

@Entity()
export class BookInProgress {
  @PrimaryKey({ type: UuidType })
  public id: string = randomUUID();

  @Property({ type: "varchar" })
  public bookId: string;

  @Property({ type: "int" })
  public currentPage: number;

  @ManyToOne(() => User, { ref: true })
  public user: Ref<User>;

  public constructor(parameters: { bookId: string; currentPage: number; user: User }) {
    this.bookId = parameters.bookId;
    this.currentPage = parameters.currentPage;
    this.user = ref(parameters.user);
  }
}
