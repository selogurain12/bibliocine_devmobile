import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  movieInProgressSchema,
  createMovieInProgressSchema,
  updateMovieInProgressSchema,
} from "../dtos/movieInProgress.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../errors";

const contract = initContract();
export const movieInProgressContract = contract.router(
  {
    createMovieInProgress: {
      path: "/",
      method: "POST",
      summary: "Create a new movie in progress",
      description: "Create a new movie in progress",
      body: createMovieInProgressSchema,
      pathParams: z.object({
        userId: z.string().uuid(),
      }),
      responses: {
        201: movieInProgressSchema,
        409: errorSchema,
      },
    },
    getMovieInProgress: {
      path: "/:movieInProgressId",
      method: "GET",
      summary: "Get a movie in progress by its ID",
      description: "Get a movie in progress by its ID",
      pathParams: idSchema.extend({
        userId: z.string().uuid(),
      }),
      responses: {
        200: movieInProgressSchema,
        404: errorSchema,
      },
    },
    getAllMoviesInProgress: {
      path: "/",
      method: "GET",
      summary: "Get all movies in progress",
      description: "Get all movies in progress",
      pathParams: z.object({
        userId: z.string().uuid(),
      }),
      responses: {
        200: ListResultSchema(movieInProgressSchema),
        404: errorSchema,
      },
    },
    updateMovieInProgress: {
      path: "/:movieInProgressId",
      method: "PATCH",
      summary: "Update a movie in progress by its ID",
      description: "Update a movie in progress by its ID",
      pathParams: idSchema.extend({
        userId: z.string().uuid(),
      }),
      body: updateMovieInProgressSchema,
      responses: {
        200: movieInProgressSchema,
        404: errorSchema,
      },
    },
    deleteMovieInProgress: {
      path: "/:movieInProgressId",
      method: "DELETE",
      summary: "Delete a movie in progress by its ID",
      description: "Delete a movie in progress by its ID",
      pathParams: idSchema.extend({
        userId: z.string().uuid(),
      }),
      body: neverDtoSchema,

      responses: {
        204: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/:userId/movies-in-progress",
  }
);
