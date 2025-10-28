import { Controller, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/authentification/authentification.guard";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { movieContract } from "@biblio-cine/source";
import { MovieService } from "src/movie/movie.service";

@Controller()
@UseGuards(AuthGuard)
export class MovieController {
  private readonly service: MovieService;

  public constructor(service: MovieService) {
    this.service = service;
  }

  @TsRestHandler(movieContract)
  public handle() {
    return tsRestHandler(movieContract, {
      getMovie: async ({ params: parameters }) => {
        const movie = await this.service.getMovie(parameters.movieId);
        return { status: 200, body: movie };
      },
      getAllMovies: async ({ params: parameters }) => {
        const movies = await this.service.searchMovie(parameters.search);
        return { status: 200, body: movies };
      },
    });
  }
}
