import { Controller, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/authentification/authentification.guard";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { bookInProgressContract } from "@biblio-cine/source";
import { BookInProgressService } from "./bookInProgress.service";

@Controller()
@UseGuards(AuthGuard)
export class BookInProgressController {
  private readonly service: BookInProgressService;

  public constructor(service: BookInProgressService) {
    this.service = service;
  }

  @TsRestHandler(bookInProgressContract)
  public handle() {
    return tsRestHandler(bookInProgressContract, {
      createBookInProgress: async ({ params: parameters, body: dto }) => {
        const bookInProgress = await this.service.create(dto, parameters.userId);
        return { status: 201, body: bookInProgress };
      },
      getBookInProgress: async ({ params: parameters }) => {
        const bookInProgress = await this.service.get(parameters.id, parameters.userId);
        return { status: 200, body: bookInProgress };
      },
      getAllBooksInProgress: async ({ params: parameters }) => {
        const bookInProgresss = await this.service.getAll(parameters.userId);
        return { status: 200, body: bookInProgresss };
      },
      updateBookInProgress: async ({ params: parameters, body: dto }) => {
        const bookInProgress = await this.service.update(parameters.id, dto, parameters.userId);
        return { status: 200, body: bookInProgress };
      },
      deleteBookInProgress: async ({ params: parameters }) => {
        await this.service.delete(parameters.id, parameters.userId);
        return { status: 200, body: undefined };
      },
    });
  }
}
