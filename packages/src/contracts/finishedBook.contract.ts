import { initContract } from "@ts-rest/core";
import { createFinishedBookSchema, finishedBookSchema } from "dtos/finishedBook.dto";
import { idSchema } from "dtos/id.dto";
import { ListResultSchema } from "dtos/list-result.dto";
import { errorSchema } from "errors";
import { z } from "zod";

const contract = initContract();
export const finishedBookContract = contract.router(
  {
    createFinishedBook: {
      path: "/",
      method: "POST",
      summary: "Create a new finished book",
      description: "Create a new finished book",
      body: createFinishedBookSchema,
      pathParams: z.object({
        userId: z.string().uuid(),
      }),
      responses: {
        201: finishedBookSchema,
        409: errorSchema,
      },
    },
    getFinishedBook: {
      path: "/:finishedBookId",
      method: "GET",
      summary: "Get a finished book by its ID",
      description: "Get a finished book by its ID",
      pathParams: idSchema.extend({
        userId: z.string().uuid(),
      }),
      responses: {
        200: finishedBookSchema,
        404: errorSchema,
      },
    },
    getAllFinishedBooks: {
      path: "/",
      method: "GET",
      summary: "Get all finished books",
      description: "Get all finished books",
      pathParams: z.object({
        userId: z.string().uuid(),
      }),
      responses: {
        200: ListResultSchema(finishedBookSchema),
        404: errorSchema,
      },
    },
    deleteFinishedBook: {
      path: "/:finishedBookId",
      method: "DELETE",
      summary: "Delete a finished book",
      description: "Delete a finished book",
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
    pathPrefix: "/:userId/finished-books",
  }
);
