import { Controller, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/authentification/authentification.guard";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { finishedBookContract } from "@biblio-cine/source";
import { FinishedBookService } from "./finishedBook.service";

@Controller()
@UseGuards(AuthGuard)
export class FinishedBookController {
  private readonly service: FinishedBookService;

  public constructor(service: FinishedBookService) {
    this.service = service;
  }

  @TsRestHandler(finishedBookContract)
  public handle() {
    return tsRestHandler(finishedBookContract, {
      createFinishedBook: async ({ params: parameters, body: dto }) => {
        const finishedBook = await this.service.create(dto, parameters.userId);
        return { status: 201, body: finishedBook };
      },
      getFinishedBook: async ({ params: parameters }) => {
        const finishedBook = await this.service.get(parameters.id, parameters.userId);
        return { status: 200, body: finishedBook };
      },
      getAllFinishedBooks: async ({ params: parameters }) => {
        const finishedBooks = await this.service.getAll(parameters.userId);
        return { status: 200, body: finishedBooks };
      },
      deleteFinishedBook: async ({ params: parameters }) => {
        await this.service.delete(parameters.id, parameters.userId);
        return { status: 200, body: undefined };
      },
    });
  }
}
