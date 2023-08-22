import { en } from "./en.ts";
import { es } from "./es.ts";
import { Localization } from "../../plugin/blog.ts";

type Lang = {
  [key: string]: Localization;
};

export const languages: Lang = {
  "en": en,
  "es": es,
};
