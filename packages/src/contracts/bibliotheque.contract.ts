import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../errors";
import {
  bibliothequeSchema,
  createBibliothequeSchema,
  updateBibliothequeSchema,
} from "../dtos/bibliotheque.dto";

const contract = initContract();
export const bibliothequeContract = contract.router(
  {
    createBibliotheque: {
      path: "/",
      method: "POST",
      summary: "Create a new bibliotheque",
      description: "Create a new bibliotheque",
      body: createBibliothequeSchema,
      pathParams: z.object({
        userId: z.string().uuid(),
      }),
      responses: {
        201: bibliothequeSchema,
        409: errorSchema,
      },
    },
    getBibliotheque: {
      path: "/:bibliothequeId",
      method: "GET",
      summary: "Get a bibliotheque by its ID",
      description: "Get a bibliotheque by its ID",
      pathParams: idSchema.extend({
        userId: z.string().uuid(),
      }),
      responses: {
        200: bibliothequeSchema,
        404: errorSchema,
      },
    },
    getAllBibliotheques: {
      path: "/",
      method: "GET",
      summary: "Get all bibliotheques",
      description: "Get all bibliotheques",
      pathParams: z.object({
        userId: z.string().uuid(),
      }),
      responses: {
        200: ListResultSchema(bibliothequeSchema),
        404: errorSchema,
      },
    },
    updateBibliotheque: {
      path: "/:bibliothequeId",
      method: "PATCH",
      summary: "Update a bibliotheque by its ID",
      description: "Update a bibliotheque by its ID",
      pathParams: idSchema.extend({
        userId: z.string().uuid(),
      }),
      body: updateBibliothequeSchema,
      responses: {
        200: bibliothequeSchema,
        404: errorSchema,
      },
    },
    deleteBibliotheque: {
      path: "/:bibliothequeId",
      method: "DELETE",
      summary: "Delete a bibliotheque by its ID",
      description: "Delete a bibliotheque by its ID",
      pathParams: idSchema.extend({
        userId: z.string().uuid(),
      }),
      body: neverDtoSchema,

      responses: {
        200: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/:userId/bibliotheques",
  }
);
