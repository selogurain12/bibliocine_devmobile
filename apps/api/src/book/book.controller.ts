import { Controller, UseGuards } from "@nestjs/common";
import { TsRestHandler, tsRestHandler } from "@ts-rest/nest";
import { bookContract } from "@biblio-cine/source";
import { AuthGuard } from "../authentification/authentification.guard";
import { BookService } from "./book.service";

@Controller()
@UseGuards(AuthGuard)
export class BookController {
  private readonly service: BookService;

  public constructor(service: BookService) {
    this.service = service;
  }

  @TsRestHandler(bookContract)
  handle() {
    return tsRestHandler(bookContract, {
      getBook: async ({ params: parameters }) => {
        const book = await this.service.getBook(parameters.id);
        return { status: 200, body: book };
      },
      getAllBooks: async ({ params: parameters }) => {
        const books = await this.service.searchbook(parameters.search);
        return { status: 200, body: books };
      },
    });
  }
}
