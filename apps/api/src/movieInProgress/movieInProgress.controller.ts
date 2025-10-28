import { Controller, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/authentification/authentification.guard";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { movieInProgressContract } from "@biblio-cine/source";
import { MovieInProgressService } from "./movieInProgress.service";

@Controller()
@UseGuards(AuthGuard)
export class MovieInProgressController {
  private readonly service: MovieInProgressService;

  public constructor(service: MovieInProgressService) {
    this.service = service;
  }

  @TsRestHandler(movieInProgressContract)
  public handle() {
    return tsRestHandler(movieInProgressContract, {
      createMovieInProgress: async ({ params: parameters, body: dto }) => {
        const movieInProgress = await this.service.create(dto, parameters.userId);
        return { status: 201, body: movieInProgress };
      },
      getMovieInProgress: async ({ params: parameters }) => {
        const movieInProgress = await this.service.get(parameters.id, parameters.userId);
        return { status: 200, body: movieInProgress };
      },
      getAllMoviesInProgress: async ({ params: parameters }) => {
        const movieInProgresss = await this.service.getAll(parameters.userId);
        return { status: 200, body: movieInProgresss };
      },
      updateMovieInProgress: async ({ params: parameters, body: dto }) => {
        const movieInProgress = await this.service.update(parameters.id, dto, parameters.userId);
        return { status: 200, body: movieInProgress };
      },
      deleteMovieInProgress: async ({ params: parameters }) => {
        await this.service.delete(parameters.id, parameters.userId);
        return { status: 200, body: undefined };
      },
    });
  }
}
