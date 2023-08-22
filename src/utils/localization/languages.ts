/* Localization */
import { en } from "./en.ts";
import { es } from "./es.ts";

export type Languages = "en" | "es" | "de";

export type Localization = {
  attribution?: string;
  nextPage?: string;
  previousPage?: string;
  nextPost?: string;
  previousPost?: string;
  continueReading?: string;
  noPostsFound?: string;
  blogTitleEnding?: string;
  archiveTitleEnding?: string;
  authorTitleEnding?: string;
  lang?: Languages;
};

type Lang = {
  [key: string]: Localization;
};

export const languages: Lang = {
  "en": en,
  "es": es,
};
