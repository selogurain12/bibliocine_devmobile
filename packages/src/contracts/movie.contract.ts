import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { ListResultSchema } from "../dtos/list-result.dto";
import { movieSchema } from "../dtos/movie.dto";
import { errorSchema } from "../errors";

const contract = initContract();
export const movieContract = contract.router(
  {
    getMovie: {
      path: "/:movieId",
      method: "GET",
      summary: "Get a movie by its ID",
      description: "Get a movie by its ID",
      pathParams: z.object({
        movieId: z.number(),
      }),
      responses: {
        200: movieSchema,
        404: errorSchema,
      },
    },
    getAllMovies: {
      path: "/:search",
      method: "GET",
      summary: "Get all movies",
      description: "Get a list of all movies",
      pathParams: z.object({
        search: z.string(),
      }),
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
