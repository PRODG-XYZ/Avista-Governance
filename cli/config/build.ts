import { write } from "../utils/is-write";

const PicoSanity = require("picosanity");
const fs = require("fs").promises;
const defaultTheme = require("tailwindcss/defaultTheme");

const client = new PicoSanity({
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "development",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  apiVersion: "2021-03-25",
  useCdn: process.env.NODE_ENV === "production",
});

export type GroqThemeType = {
  colors: { name: string; value: string }[];
  fontFamily: { name: string; value: string }[];
  fontSize: {
    name: string;
    size: string;
    lineHeight?: string;
    letterSpacing?: string;
    fontWeight?: string;
  }[];
  fontWeight: { name: string; value: string }[];
  stylesheets: string[];
};

export type ThemeType = {
  theme: {
    colors: Record<string, string>;
    fontFamily: Record<string, string[]>;
    fontSize: Record<
      string,
      | [
          string,
          {
            lineHeight?: string;
            letterSpacing?: string;
            fontWeight?: string;
          },
        ]
      | string
    >;
    fontWeight: Record<string, number>;
  };
  stylesheets: string;
  safelist: string[];
};

/**
 * Get published theme from Sanity config.theme
 */

export async function getTheme(): Promise<ThemeType> {
  const theme: GroqThemeType = await client.fetch(`*[_id == "config_theme"][0] {
    colors[] { name, value },
    fontFamily[] { name, value },
    fontSize[] { name, size, lineHeight, letterSpacing, fontWeight },
    fontWeight[] { name, value },
    "stylesheets": stylesheets[] { value }.value,
  }`);

  const colors = formatColors(theme.colors || {});
  const fontFamily = formatFontFamily(theme.fontFamily || {});
  const fontWeight = formatFontWeight(theme.fontWeight || {});
  const fontSize = formatFontSize(theme.fontSize || []);
  const safelist =
    formatSafelist({ colors, fontFamily, fontSize, fontWeight }) || [];
  const stylesheets = `/* This file is automatically generated. */

  ${theme.stylesheets?.join("\n\n")}
  `;

  return {
    theme: {
      colors,
      fontFamily,
      fontWeight,
      fontSize,
    },
    safelist,
    stylesheets,
  };
}

/**
 * Format colours
 */

export function formatColors(colors: { name: string; value: string }[]) {
  const formattedColors = colors?.filter(Boolean).reduce((acc, color) => {
    const { name, value } = color;
    const formattedName = name.replace(/ /g, "-").toLowerCase();
    acc[formattedName] = value;
    return acc;
  }, {} as ThemeType["theme"]["colors"]);
  return formattedColors;
}

/**
 * Format fonts
 */

export function formatFontFamily(fonts: { name: string; value: string }[]) {
  const formattedFonts = fonts?.filter(Boolean).reduce((acc, font) => {
    const { name, value } = font;
    const formattedName = name.replace(/ /g, "-").toLowerCase();
    acc[formattedName] = value
      .replace(/"/g, "")
      .replace(/'/g, "")
      .split(",")
      .map((font) => font.trim());
    return acc;
  }, {} as Record<string, string[]>);
  return formattedFonts;
}

/**
 * Format font weights
 */

export function formatFontWeight(weights: { name: string; value: string }[]) {
  const formattedFontWeights = weights
    ?.filter(Boolean)
    .reduce((acc, weight) => {
      const { name, value } = weight;
      const formattedName = name.replace(/ /g, "-").toLowerCase();
      acc[formattedName] = +value
        .toString()
        .replace(/"/g, "")
        .replace(/'/g, "")
        .trim();
      return acc;
    }, {} as ThemeType["theme"]["fontWeight"]);
  return formattedFontWeights;
}

/**
 * Format font sizes with lineheight, letter spacing and font weight
 * e.g
 *
 * ['1.5rem', {
 *  lineHeight: '2rem',
 *  letterSpacing: '-0.01em',
 *  fontWeight: '500',
 * }],
 */

export function formatFontSize(
  fontSizes: GroqThemeType["fontSize"],
): ThemeType["theme"]["fontSize"] {
  const formattedFontSizes = fontSizes?.reduce((acc, fontSize) => {
    const { name, size, lineHeight, letterSpacing, fontWeight } = fontSize;
    const formattedName = name.replace(/ /g, "-").toLowerCase();

    if (!lineHeight && !letterSpacing && !fontWeight) {
      return { ...acc, [formattedName]: size };
    }

    const obj: ThemeType["theme"]["fontSize"][0][1] = {};
    if (lineHeight) obj["lineHeight"] = lineHeight;
    if (letterSpacing) obj["letterSpacing"] = letterSpacing;
    if (fontWeight) obj["fontWeight"] = fontWeight;

    acc[formattedName] = [size, obj];

    return acc;
  }, {} as ThemeType["theme"]["fontSize"]);

  return formattedFontSizes;
}

/**
 * format safelist of colours and fonts
 * e.g safelist: ["bg-primary", "text-primary", "font-primary", "md:bg-primary", "lg:bg-primary", ...]
 */

export function formatSafelist({
  colors = {},
  fontFamily = {},
  fontSize = {},
  fontWeight = {},
}: ThemeType["theme"]) {
  function clean(str: string) {
    return str.replace(/ /g, "-").toLowerCase();
  }

  const safelist = [
    ...Object.keys(colors).map((color) => `bg-${clean(color)}`),
    ...Object.keys(colors).map((color) => `text-${clean(color)}`),
    ...Object.keys(colors).map((color) => `border-${clean(color)}`),
    ...Object.keys(colors).map((color) => `divide-${clean(color)}`),
    ...Object.keys(fontFamily).map((font) => `font-${clean(font)}`),
    ...Object.keys(fontWeight).map((weight) => `font-${clean(weight)}`),
    ...Object.keys(fontSize).map((size) => `text-${clean(size)}`),
  ];

  // safelist all these classes for each breakpoint
  const safelistWithBreakpoints = safelist.reduce((acc, className) => {
    Object.keys(defaultTheme.screens).forEach((screen) => {
      acc.push(`${screen}:${className}`);
    });
    return acc;
  }, [] as string[]);

  return safelistWithBreakpoints;
}

export default async function generateTheme() {
  const theme = await getTheme();

  await fs.writeFile(
    `${__dirname}/../../engine.config.js`,
    `// NOTE: This file should not be edited
    
export default ${JSON.stringify(theme, null, 2)}`,
  );

  // write stylesheets to file
  await fs.writeFile(
    `${__dirname}/../../public/engine.styles.css`,
    theme.stylesheets,
  );
}

if (write) generateTheme();
