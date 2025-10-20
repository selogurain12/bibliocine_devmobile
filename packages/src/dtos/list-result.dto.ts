import { z, type ZodSchema, type ZodTypeAny } from "zod";

export function ListResultSchema<Data extends ZodTypeAny>(
  dataSchema: Data
): ZodSchema<{
  data: Data["_type"][];
  total: number;
}> {
  return z.object({
    data: z.array(dataSchema),
    total: z.number(),
  }) as ZodSchema<{
    data: Data["_type"][];
    total: number;
  }>;
}

export interface ListResult<DataType> {
  data: DataType[];
  total: number;
}
