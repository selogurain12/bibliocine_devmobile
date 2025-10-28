import { Entity, Property } from "@mikro-orm/postgresql";

@Entity()
export class Movie {
  @Property({
    type: "int",
  })
  public id: number;

  @Property({ type: "varchar" })
  public backdropPath: string;

  @Property({ type: "array" })
  public genreIds: string[];

  @Property({ type: "varchar" })
  public originalLanguage: string;

  @Property({ type: "varchar" })
  public originalTitle: string;

  @Property({ type: "text" })
  public overview: string;

  @Property({ type: "varchar" })
  public posterPath: string;

  @Property({ type: "varchar" })
  public releaseDate: string;

  @Property({ type: "varchar" })
  public title: string;

  @Property({ type: "int" })
  public budget: number;

  @Property({ type: "varchar" })
  public homepage: string;

  @Property({ type: "int" })
  public revenue: number;

  @Property({ type: "int" })
  public runtime: number;

  @Property({ type: "number" })
  public voteAverage: number;
}
