import { randomUUID } from "crypto";
import { Entity, PrimaryKey, Property, UuidType } from "@mikro-orm/postgresql";

@Entity()
export class Book {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({ type: "varchar" })
  title: string;

  @Property({ type: "array" })
  authors: string[];

  @Property({ type: "varchar" })
  publisher: string;

  @Property({ type: "varchar" })
  imageLink: string;

  @Property({ type: "varchar" })
  publisherDate: string;

  @Property({ type: "text" })
  description: string;

  @Property({ type: "varchar" })
  industryIdentifierstype: string | undefined;

  @Property({ type: "varchar" })
  industryIdentifieridentyfier: string | undefined;

  @Property({ type: "int" })
  pageCount: number;

  @Property({ type: "array" })
  categories: string[];

  @Property({ type: "int" })
  retailPriceamount: number | undefined;

  @Property({ type: "varchar" })
  retailPricecurrencyCode: string | undefined;

  @Property({ type: "varchar" })
  retailPricebuyLink: string | undefined;
}
