import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { createFinishedMovieSchema, finishedMovieSchema } from "../dtos/finishedMovie.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../errors";

const contract = initContract();
export const finishedMovieContract = contract.router(
  {
    createFinishedMovie: {
      path: "/",
      method: "POST",
      summary: "Create a new finished movie",
      description: "Create a new finished movie",
      body: createFinishedMovieSchema,
      pathParams: z.object({
        userId: z.string().uuid(),
      }),
      responses: {
        201: finishedMovieSchema,
        409: errorSchema,
      },
    },
    getFinishedMovie: {
      path: "/:finishedMovieId",
      method: "GET",
      summary: "Get a finished movie by its ID",
      description: "Get a finished movie by its ID",
      pathParams: idSchema.extend({
        userId: z.string().uuid(),
      }),
      responses: {
        200: finishedMovieSchema,
        404: errorSchema,
      },
    },
    getAllFinishedMovies: {
      path: "/",
      method: "GET",
      summary: "Get all finished movies",
      description: "Get all finished movies",
      pathParams: z.object({
        userId: z.string().uuid(),
      }),
      responses: {
        200: ListResultSchema(finishedMovieSchema),
        404: errorSchema,
      },
    },
    deleteFinishedMovie: {
      path: "/:finishedMovieId",
      method: "DELETE",
      summary: "Delete a finished movie",
      description: "Delete a finished movie",
      pathParams: idSchema.extend({
        userId: z.string().uuid(),
      }),
      responses: {
        204: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/:userId/finished-movies",
  }
);
