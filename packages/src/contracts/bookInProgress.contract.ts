import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  bookInProgressSchema,
  createBookInProgressSchema,
  updateBookInProgressSchema,
} from "../dtos/bookInProgress.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../errors";

const contract = initContract();
export const bookInProgressContract = contract.router(
  {
    createBookInProgress: {
      path: "/",
      method: "POST",
      summary: "Create a new book in progress",
      description: "Create a new book in progress",
      body: createBookInProgressSchema,
      pathParams: z.object({
        userId: z.string().uuid(),
      }),
      responses: {
        201: bookInProgressSchema,
        409: errorSchema,
      },
    },
    getBookInProgress: {
      path: "/:bookInProgressId",
      method: "GET",
      summary: "Get a book in progress by its ID",
      description: "Get a book in progress by its ID",
      pathParams: idSchema.extend({
        userId: z.string().uuid(),
      }),
      responses: {
        200: bookInProgressSchema,
        404: errorSchema,
      },
    },
    getAllBooksInProgress: {
      path: "/",
      method: "GET",
      summary: "Get all books in progress",
      description: "Get all books in progress",
      pathParams: z.object({
        userId: z.string().uuid(),
      }),
      responses: {
        200: ListResultSchema(bookInProgressSchema),
        404: errorSchema,
      },
    },
    updateBookInProgress: {
      path: "/:bookInProgressId",
      method: "PATCH",
      summary: "Update a book in progress by its ID",
      description: "Update a book in progress by its ID",
      pathParams: idSchema.extend({
        userId: z.string().uuid(),
      }),
      body: updateBookInProgressSchema,
      responses: {
        200: bookInProgressSchema,
        404: errorSchema,
      },
    },
    deleteBookInProgress: {
      path: "/:bookInProgressId",
      method: "DELETE",
      summary: "Delete a book in progress by its ID",
      description: "Delete a book in progress by its ID",
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
    pathPrefix: "/:userId/books-in-progress",
  }
);
