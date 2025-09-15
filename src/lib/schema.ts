import { z } from "zod";

export const Citation = z.object({
  sourceId: z.string(),
  page: z.number().int(),
  field: z.string(),
  bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]), // [x,y,w,h] in page px
  confidence: z.number().min(0).max(1)
});

export const J294 = z.object({
  formType: z.literal("J294"),
  deceased: z.object({
    fullName: z.string(),
    deathDate: z.string(),          // ISO yyyy-mm-dd (normalized)
    deathPlace: z.string(),
    residence: z.string().optional(),
    maritalStatus: z.enum(["getroud","ongetroud","weduwee","weduenaar"]),
    spouse: z.string().optional()
  }),
  parents: z.object({
    father: z.string().optional(),
    mother: z.string().optional()
  }).optional(),
  children: z.array(z.object({
    name: z.string(),
    status: z.enum(["minderjarig","meerderjarig"]).optional(),
    birth: z.string().optional(),   // ISO if known
    spouse: z.string().optional(),
    notes: z.string().optional()
  })),
  citations: z.array(Citation)
});

export const NormalizedCase = z.object({
  caseId: z.string(),               // generated UUID
  packetId: z.string(),             // e.g. fs:tab:1960:mhg-2322
  persons: z.array(z.object({
    id: z.string(),                 // local UUID
    primaryName: z.string(),
    gender: z.enum(["M","F","U"]).optional(),
    birth: z.object({date:z.string().optional(), place:z.string().optional()}).optional(),
    death: z.object({date:z.string().optional(), place:z.string().optional()}).optional()
  })),
  events: z.array(z.object({
    id: z.string(),
    type: z.enum(["Death","Probate"]),
    date: z.string().optional(),
    place: z.string().optional(),
    participants: z.array(z.object({ personId: z.string(), role: z.string() }))
  })),
  relationships: z.array(z.object({
    type: z.enum(["parentOf","spouseOf"]),
    from: z.string(),
    to: z.string()
  })),
  sources: z.array(z.object({
    id: z.string(),
    repo: z.string(),               // "familysearch-tab"
    title: z.string(),
    packetId: z.string()
  })),
  citations: z.array(Citation)
});

export type J294Type = z.infer<typeof J294>;
export type NormalizedCaseType = z.infer<typeof NormalizedCase>;
export type CitationType = z.infer<typeof Citation>;