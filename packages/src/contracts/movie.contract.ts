import { initContract } from "@ts-rest/core";
import { ListResultSchema } from "dtos/list-result.dto";
import { movieSchema } from "dtos/movie.dto";
import { errorSchema } from "errors";

const contract = initContract();
export const movieContract = contract.router(
  {
    getMovie: {
      path: "/:movieId",
      method: "GET",
      summary: "Get a movie by its ID",
      description: "Get a movie by its ID",
      responses: {
        200: movieSchema,
        404: errorSchema,
      },
    },
    getAllMovies: {
      path: "/",
      method: "GET",
      summary: "Get all movies",
      description: "Get a list of all movies",
      responses: {
        200: ListResultSchema(movieSchema),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/movies",
  }
);
