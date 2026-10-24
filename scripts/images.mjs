// Makes the .avif copies of every photo in images/covers and images/shots
// that the site actually serves, then lists them all in _data/images.yml so
// the templates can build srcset and sizes. Run with `npm run images` after
// adding a photo.
//
// Drop the full-size original in one of those folders, named the way tiles
// will refer to it, e.g. images/shots/ic-lights.jpg. Use the best copy you
// have (PNG for renders): every size is made from it, and the original
// itself is never sent to visitors.

import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DIRS = ["images/covers", "images/shots"];
const WIDTHS = [480, 800, 1200, 1600, 2400];
const ORIGINAL = /\.(jpe?g|png|webp)$/i;
// 10-bit with full colour keeps the soft glows in the renders from banding
const AVIF = { quality: 70, chromaSubsampling: "4:4:4", bitdepth: 10 };

async function mtime(file) {
	try {
		return (await stat(file)).mtimeMs;
	} catch {
		return 0;
	}
}

const images = {};
let made = 0;

for (const dir of DIRS) {
	for (const file of (await readdir(dir)).sort()) {
		if (!ORIGINAL.test(file)) continue;

		const name = file.replace(ORIGINAL, "");
		const src = path.join(dir, file);
		if (images[name]) {
			console.warn(`skipping ${src}: another original is already named "${name}"; delete one`);
			continue;
		}

		// Camera photos can be stored sideways with a rotation tag; use the upright size
		const meta = await sharp(src).metadata();
		const sideways = meta.orientation >= 5;
		const width = sideways ? meta.height : meta.width;
		const height = sideways ? meta.width : meta.height;
		const widths = [...WIDTHS.filter((w) => w < width), width];

		for (const w of widths) {
			const out = path.join(dir, `${name}-${w}.avif`);
			if ((await mtime(out)) >= (await mtime(src))) continue;
			await sharp(src).rotate().resize(w).avif(AVIF).toFile(out);
			console.log(`made ${out}`);
			made++;
		}

		images[name] = { base: `/${dir}/${name}`, width, height, widths };
	}
}

const yaml = [
	"# Made by `npm run images`. Don't edit by hand; rerun the script instead.",
	...Object.entries(images).map(([name, img]) =>
		[
			`${name}:`,
			`  base: ${img.base}`,
			`  width: ${img.width}`,
			`  height: ${img.height}`,
			`  widths: [${img.widths.join(", ")}]`,
		].join("\n"),
	),
	"",
].join("\n");

await writeFile("_data/images.yml", yaml);
console.log(`${Object.keys(images).length} photos listed in _data/images.yml, ${made} new sizes made`);
