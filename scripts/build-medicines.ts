// // Builds src/data/medicines.json from the HPRA's register of medicines authorised in Ireland.
// // Run with: npx tsx scripts/build-medicines.ts
// // Re-run whenever you want a fresher list, then ship it with an OTA update.
// import { XMLParser } from "fast-xml-parser";
// import { mkdirSync, writeFileSync } from "node:fs";
// import { dirname, join } from "node:path";

// const SOURCE = "https://assets.hpra.ie/products/xml/latestHumanlist.xml";
// const OUTPUT = join(__dirname, "..", "src", "data", "medicines.json");

// export type Medicine = {
//   name: string;
//   substance: string;
// };

// // Empty fields in the file come through as "" or as nil markers; keep only real text.
// function text(value: unknown): string {
//   return typeof value === "string" ? value.trim() : "";
// }

// function toList(value: unknown): unknown[] {
//   if (value === undefined || value === null || value === "") return [];
//   return Array.isArray(value) ? value : [value];
// }

// async function main() {
//   const response = await fetch(SOURCE);
//   if (!response.ok)
//     throw new Error(
//       `Download failed: ${response.status} ${response.statusText}`,
//     );
//   const xml = await response.text();

//   const parser = new XMLParser({
//     ignoreAttributes: true,
//     removeNSPrefix: true,
//     isArray: (name) => name === "Product" || name === "ActiveSubstance",
//   });
//   const products = toList(parser.parse(xml)?.Products?.Product) as Record<
//     string,
//     any
//   >[];

//   // One entry per product name; the same name can appear under several licences.
//   const byName = new Map<string, Medicine>();
//   for (const product of products) {
//     const name = text(product.ProductName);
//     if (!name || byName.has(name.toLowerCase())) continue;

//     const substance = toList(product.ActiveSubstances?.ActiveSubstance)
//       .map(text)
//       .filter(Boolean)
//       .join(", ");

//     byName.set(name.toLowerCase(), { name, substance });
//   }

//   const medicines = [...byName.values()].sort((a, b) =>
//     a.name.localeCompare(b.name),
//   );

//   mkdirSync(dirname(OUTPUT), { recursive: true });
//   writeFileSync(OUTPUT, JSON.stringify(medicines));

//   console.log(`Wrote ${medicines.length} medicines to ${OUTPUT}`);
// }

// main().catch((error) => {
//   console.error(error);
//   process.exit(1);
// });
