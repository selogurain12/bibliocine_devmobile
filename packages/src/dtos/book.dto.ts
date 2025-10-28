import { z } from "zod";

export const bookSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255),
  authors: z.array(z.string()).min(2).max(100),
  publisher: z.string().min(2).max(100),
  imageLink: z.string().url(),
  //TODO: voir si on peut pas le définir en tant que date
  publisherDate: z.string(),
  description: z.string().min(2).max(1000),
  industryIdentifiersType: z.string().optional(),
  industryIdentifieridentyfier: z.string().optional(),
  pageCount: z.number().min(1),
  categories: z.array(z.string()),
  retailPriceAmount: z.number().optional(),
  retailPricecurrencyCode: z.string().optional(),
  retailPricebuyLink: z.string().url().optional(),
});

export const returnApiBookSchema = z.object({
  kind: z.string(),
  id: z.string(),
  etag: z.string(),
  selfLink: z.string().url(),
  volumeInfo: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    publisher: z.string(),
    publishedDate: z.string(),
    description: z.string(),
    industryIdentifiers: z.array(
      z.object({
        type: z.string(),
        identifier: z.string(),
      })
    ),
    readingModes: z
      .object({
        text: z.boolean().optional(),
        image: z.boolean().optional(),
      })
      .optional(),
    pageCount: z.number(),
    printType: z.string().optional(),
    categories: z.array(z.string()),
    averageRating: z.number().optional(),
    ratingsCount: z.number().optional(),
    maturityRating: z.string().optional(),
    allowAnonLogging: z.boolean().optional(),
    contentVersion: z.string().optional(),
    penalizationSummary: z
      .object({
        containsEpubBubbles: z.string().optional(),
        containsImageBubbles: z.string().optional(),
      })
      .optional(),
    imageLinks: z.object({
      smallThumbnail: z.string().url(),
      thumbnail: z.string().url(),
    }),
    languages: z.string().optional(),
    previewLink: z.string().url().optional(),
    infoLink: z.string().url().optional(),
    canonicalVolumeLink: z.string().url().optional(),
  }),
  saleInfo: z
    .object({
      country: z.string().optional(),
      saleability: z.string().optional(),
      isEbook: z.boolean().optional(),
      listPrice: z
        .object({
          amount: z.number().optional(),
          currencyCode: z.string().optional(),
        })
        .optional(),
      retailPrice: z
        .object({
          amount: z.number().optional(),
          currencyCode: z.string().optional(),
        })
        .optional(),
      buyLink: z.string().url().optional(),
      offers: z
        .array(
          z.object({
            finskyOfferType: z.number().optional(),
            listPrice: z
              .object({
                amountInMicros: z.number().optional(),
                currencyCode: z.string().optional(),
              })
              .optional(),
            retailPrice: z
              .object({
                amountInMicros: z.number().optional(),
                currencyCode: z.string().optional(),
              })
              .optional(),
            giftable: z.boolean().optional(),
          })
        )
        .optional(),
    })
    .optional(),
  accessInfo: z
    .object({
      country: z.string().optional(),
      viewability: z.string().optional(),
      embeddable: z.boolean().optional(),
      publicDomain: z.boolean().optional(),
      textToSpeechPermission: z.string().optional(),
      epub: z
        .object({
          isAvailable: z.boolean().optional(),
          acsTokenLink: z.string().url().optional(),
        })
        .optional(),
      pdf: z
        .object({
          isAvailable: z.boolean().optional(),
          acsTokenLink: z.string().url().optional(),
        })
        .optional(),
      webReaderLink: z.string().url().optional(),
      accessViewStatus: z.string().optional(),
      quoteSharingAllowed: z.boolean().optional(),
    })
    .optional(),
  searchInfo: z
    .object({
      textSnippet: z.string().optional(),
    })
    .optional(),
});

export const returnApiErrorSchema = z.object({
  error: z.object({
    code: z.number(),
    message: z.string(),
    errors: z.array(
      z.object({
        message: z.string(),
        domain: z.string(),
        reason: z.string(),
      })
    ),
  }),
});

export type BookDto = z.infer<typeof bookSchema>;
export type ReturnApiBookDto = z.infer<typeof returnApiBookSchema>;
export type ReturnApiErrorDto = z.infer<typeof returnApiErrorSchema>;
