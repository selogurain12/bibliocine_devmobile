import { Controller, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/authentification/authentification.guard";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { statsContract } from "@biblio-cine/source";
import { StatService } from "./stat.service";

@Controller()
@UseGuards(AuthGuard)
export class StatController {
  private readonly service: StatService;

  public constructor(service: StatService) {
    this.service = service;
  }

  @TsRestHandler(statsContract)
  public handle() {
    return tsRestHandler(statsContract, {
      simpleStats: async ({ params: parameters }) => {
        const stat = await this.service.simpleStat(parameters.userId);
        return { status: 200, body: stat };
      },
      allStats: async ({ params: parameters }) => {
        const stats = await this.service.stats(parameters.userId);
        return { status: 200, body: stats };
      },
      updateStats: async ({ params: parameters, body: dto }) => {
        const stat = await this.service.update(parameters.id, parameters.userId, dto);
        return { status: 200, body: stat };
      },
    });
  }
}
