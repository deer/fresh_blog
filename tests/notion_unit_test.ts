import { assertEquals } from "./test_deps.ts";

import {
  getContentFromRichTextItem,
  parseCheckbox,
  parseDate,
  parseMultiSelect,
  parseRichText,
  parseTitle,
} from "../src/utils/posts.ts";
import type { PropertyValueType } from "../src/utils/posts.ts";

const mockAnnotationResponse = {
  bold: false,
  italic: false,
  strikethrough: false,
  underline: false,
  code: false,
  color: "blue" as const,
};

const mockRichTextProperty: PropertyValueType = {
  type: "rich_text",
  rich_text: [
    {
      type: "text",
      text: { content: "Hello,", link: { url: "asdf" } },
      annotations: mockAnnotationResponse,
      plain_text: "",
      href: null,
    },
    {
      type: "mention",
      plain_text: "world!",
      annotations: mockAnnotationResponse,
      href: null,
      mention: { type: "page", page: { id: "" } },
    },
  ],
  id: "",
};

const mockTitleProperty: PropertyValueType = {
  type: "title",
  title: [{
    type: "text",
    text: { content: "Hello world", link: { url: "asdf" } },
    annotations: mockAnnotationResponse,
    plain_text: "",
    href: null,
  }],
  id: "",
};

const mockDateProperty: PropertyValueType = {
  type: "date",
  date: { start: "2023-08-12T00:00:00Z", end: null, time_zone: null },
  id: "",
};

const mockCheckboxProperty: PropertyValueType = {
  type: "checkbox",
  checkbox: true,
  id: "",
};

const mockMultiSelectProperty: PropertyValueType = {
  type: "multi_select",
  multi_select: [{ name: "Option1", id: "1", color: "default" }, {
    name: "Option2",
    id: "2",
    color: "brown",
  }],
  id: "",
};

Deno.test("parseTitle - title", () => {
  const result = parseTitle(mockTitleProperty);
  assertEquals(result, "Hello world");
});

Deno.test("parseTitle - non-title", () => {
  const result = parseTitle(mockRichTextProperty);
  assertEquals(result, "");
});

Deno.test("parseRichText - rich_text", () => {
  const result = parseRichText(mockRichTextProperty);
  assertEquals(result, "Hello, world!");
});

Deno.test("parseRichText - non-rich_text", () => {
  const result = parseRichText(mockTitleProperty);
  assertEquals(result, "");
});

Deno.test("getContentFromRichTextItem - text", () => {
  const result = getContentFromRichTextItem({
    type: "text",
    text: { content: "Hello world", link: { url: "asdf" } },
    annotations: mockAnnotationResponse,
    plain_text: "",
    href: null,
  });
  assertEquals(result, "Hello world");
});

Deno.test("getContentFromRichTextItem - mention", () => {
  const result = getContentFromRichTextItem({
    type: "mention",
    plain_text: "@mention",
    annotations: mockAnnotationResponse,
    href: "",
    mention: { type: "page", page: { id: "" } },
  });
  assertEquals(result, "@mention");
});

Deno.test("getContentFromRichTextItem - equation", () => {
  const result = getContentFromRichTextItem({
    type: "equation",
    plain_text: "E=mc^2",
    equation: { expression: "E=mc^2" },
    annotations: mockAnnotationResponse,
    href: "",
  });
  assertEquals(result, "E=mc^2");
});

Deno.test("getContentFromRichTextItem - unsupported type", () => {
  const result = getContentFromRichTextItem({
    //@ts-expect-error pass in some bad data here
    type: "unsupported",
    plain_text: "Unsupported",
  });
  assertEquals(result, "");
});

Deno.test("parseDate - date", () => {
  const result = parseDate(mockDateProperty);
  assertEquals(result, new Date("2023-08-12T00:00:00Z"));
});

Deno.test("parseDate - non-date", () => {
  const result = parseDate(mockTitleProperty);
  assertEquals(result, new Date());
});

Deno.test("parseCheckbox - checkbox", () => {
  const result = parseCheckbox(mockCheckboxProperty);
  assertEquals(result, true);
});

Deno.test("parseCheckbox - non-checkbox", () => {
  const result = parseCheckbox(mockTitleProperty);
  assertEquals(result, false);
});

Deno.test("parseMultiSelect - multi_select", () => {
  const result = parseMultiSelect(mockMultiSelectProperty);
  assertEquals(result, ["Option1", "Option2"]);
});

Deno.test("parseMultiSelect - non-multi_select", () => {
  const result = parseMultiSelect(mockTitleProperty);
  assertEquals(result, []);
});
