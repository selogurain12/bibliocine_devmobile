import { initContract } from "@ts-rest/core";
import { connectResponseSchema, createAccountSchema, loginSchema } from "../dtos/user.dto";
import { errorSchema } from "../errors";

const contract = initContract();
export const authContract = contract.router(
  {
    register: {
      path: "/create",
      method: "POST",
      summary: "Create an account",
      description: "Create an account",
      body: createAccountSchema,
      responses: {
        201: connectResponseSchema,
        409: errorSchema,
      },
    },
    login: {
      path: "/login",
      method: "POST",
      summary: "Login to account",
      description: "Login to account",
      body: loginSchema,
      responses: {
        201: connectResponseSchema,
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/auth",
  }
);
