import { initContract } from "@ts-rest/core";
import {
  filmothequeSchema,
  createFilmothequeSchema,
  updateFilmothequeSchema,
} from "dtos/filmotheque.dto";
import { neverDtoSchema } from "dtos/delete-request.dto";
import { idSchema } from "dtos/id.dto";
import { ListResultSchema } from "dtos/list-result.dto";
import { errorSchema } from "errors";
import { z } from "zod";

const contract = initContract();
export const filmothequeContract = contract.router(
  {
    createFilmotheque: {
      path: "/",
      method: "POST",
      summary: "Create a new filmotheque",
      description: "Create a new filmotheque",
      body: createFilmothequeSchema,
      pathParams: z.object({
        userId: z.string().uuid(),
      }),
      responses: {
        201: filmothequeSchema,
        409: errorSchema,
      },
    },
    getFilmotheque: {
      path: "/:filmothequeId",
      method: "GET",
      summary: "Get a filmotheque by its ID",
      description: "Get a filmotheque by its ID",
      pathParams: idSchema.extend({
        userId: z.string().uuid(),
      }),
      responses: {
        200: filmothequeSchema,
        404: errorSchema,
      },
    },
    getAllFilmotheques: {
      path: "/",
      method: "GET",
      summary: "Get all filmotheques",
      description: "Get all filmotheques",
      pathParams: z.object({
        userId: z.string().uuid(),
      }),
      responses: {
        200: ListResultSchema(filmothequeSchema),
        404: errorSchema,
      },
    },
    updateFilmotheque: {
      path: "/:filmothequeId",
      method: "PATCH",
      summary: "Update a filmotheque by its ID",
      description: "Update a filmotheque by its ID",
      pathParams: idSchema.extend({
        userId: z.string().uuid(),
      }),
      body: updateFilmothequeSchema,
      responses: {
        200: filmothequeSchema,
        404: errorSchema,
      },
    },
    deleteFilmotheque: {
      path: "/:filmothequeId",
      method: "DELETE",
      summary: "Delete a filmotheque by its ID",
      description: "Delete a filmotheque by its ID",
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
    pathPrefix: "/:userId/filmotheques",
  }
);
