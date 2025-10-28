import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { bookSchema } from "../dtos/book.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../errors";

const contract = initContract();
export const bookContract = contract.router(
  {
    getBook: {
      path: "/:bookId",
      method: "GET",
      summary: "Get a book by its ID",
      description: "Get a book by its ID",
      pathParams: idSchema,
      responses: {
        200: bookSchema,
        404: errorSchema,
      },
    },
    getAllBooks: {
      path: "/:search",
      method: "GET",
      summary: "Get all books",
      description: "Get a list of all books",
      pathParams: z.object({
        search: z.string(),
      }),
      responses: {
        200: ListResultSchema(bookSchema),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/books",
  }
);
