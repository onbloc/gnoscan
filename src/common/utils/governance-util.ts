import unescape from "lodash/unescape";

const numberFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

export const formatGovernanceNumber = (value: number): string => numberFormatter.format(value);

// Decode references as text, never as markup.
export const decodeGovernanceTitle = (title: string): string =>
  title.replace(/&(?:#(x[0-9a-f]+|[0-9]+)|amp|lt|gt|quot|apos|#39|nbsp);/gi, entity => {
    if (entity.toLowerCase() === "&nbsp;") return "\u00a0";
    if (entity.toLowerCase() === "&apos;") return "'";
    if (!entity.startsWith("&#")) return unescape(entity);
    const raw = entity.slice(2, -1);
    const point = raw[0].toLowerCase() === "x" ? parseInt(raw.slice(1), 16) : Number(raw);
    return point > 0 && point <= 0x10ffff && !(point >= 0xd800 && point <= 0xdfff)
      ? String.fromCodePoint(point)
      : "\ufffd";
  });
