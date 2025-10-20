import { z } from "zod";

export const bookSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255),
  author: z.array(z.string()).min(2).max(100),
  publisher: z.string().min(2).max(100),
  imageLink: z.string().url(),
  //TODO: voir si on peut pas le définir en tant que date
  publisherDate: z.string(),
  description: z.string().min(2).max(1000),
  industryIdentifiersType: z.string(),
  industryIdentifieridentyfier: z.string(),
  pageCount: z.number().min(1),
  categories: z.array(z.string()),
  retailPriceAmount: z.number().nullable(),
  retailPricecurrencyCode: z.string(),
  retailPricebuyLink: z.string().url().nullable(),
});

export type BookDto = z.infer<typeof bookSchema>;
