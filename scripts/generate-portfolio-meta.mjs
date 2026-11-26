import {
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const rootDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contentDirectory = resolve(rootDirectory, "content");
const metadataDirectory = resolve(rootDirectory, "meta");
const excerptLength = 40;

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readFrontmatter(source, filePath) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    throw new Error(
      `Missing YAML frontmatter in ${relative(rootDirectory, filePath)}`,
    );
  }

  const frontmatter = parse(match[1]);
  if (!isRecord(frontmatter)) {
    throw new Error(
      `Expected YAML frontmatter to be an object in ${relative(rootDirectory, filePath)}`,
    );
  }

  return { frontmatter, body: source.slice(match[0].length) };
}

function requireString(value, field, filePath) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `Expected "${field}" to be a non-empty string in ${relative(rootDirectory, filePath)}`,
    );
  }
  return value;
}

function normalizeDate(value, filePath) {
  if (value === undefined) return undefined;
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string") return value;
  throw new Error(
    `Expected "date" to be a string in ${relative(rootDirectory, filePath)}`,
  );
}

function getPlainText(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, " $1 ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, " $1 ")
    .replace(/^#{1,6}\s+.*$/gm, " ")
    .replace(/^\s*(?:[-*_]\s*){3,}\s*$/gm, " ")
    .replace(/^\s*>\s?/gm, "")
    .replace(/^\s*(?:[-*+]|\d+[.)])\s+/gm, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(text) {
  return [
    ...text.matchAll(
      /\p{Script=Han}|[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]|[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu,
    ),
  ].length;
}

function createExcerpt(text) {
  const characters = Array.from(text);
  if (characters.length <= excerptLength) return text;
  return `${characters.slice(0, excerptLength).join("").trimEnd()}…`;
}

function collectMarkdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return collectMarkdownFiles(path);
      return entry.isFile() && entry.name.endsWith(".md") ? [path] : [];
    })
    .sort((left, right) => left.localeCompare(right, "en"));
}

function getPreviousOrder(metadataPath) {
  if (!existsSync(metadataPath)) return new Map();
  const previous = JSON.parse(readFileSync(metadataPath, "utf8"));
  if (!Array.isArray(previous.items)) return new Map();
  return new Map(previous.items.map((item, index) => [item.id, index]));
}

function withoutGeneratedAt(value) {
  const content = { ...value };
  delete content.generatedAt;
  return content;
}

function writeGeneratedJson(
  filePath,
  data,
  generatedAt,
  preserveTimestamp = true,
) {
  const previous = existsSync(filePath)
    ? JSON.parse(readFileSync(filePath, "utf8"))
    : undefined;
  const content = withoutGeneratedAt(data);
  const timestamp =
    preserveTimestamp &&
    previous &&
    JSON.stringify(withoutGeneratedAt(previous)) === JSON.stringify(content) &&
    typeof previous.generatedAt === "string"
      ? previous.generatedAt
      : generatedAt;
  const outputData = Object.hasOwn(data, "collection")
    ? {
        collection: data.collection,
        count: data.count,
        generatedAt: timestamp,
        items: data.items,
      }
    : { generatedAt: timestamp, ...data };
  const output = `${JSON.stringify(outputData, null, 2)}\n`;

  mkdirSync(dirname(filePath), { recursive: true });
  if (!existsSync(filePath) || readFileSync(filePath, "utf8") !== output) {
    writeFileSync(filePath, output);
  }
  return timestamp;
}

const collectionDirectories = readdirSync(contentDirectory, {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory())
  .sort((left, right) => left.name.localeCompare(right.name, "en"));

const generatedAt = new Date().toISOString();
const collections = [];
let total = 0;

for (const entry of collectionDirectories) {
  const collection = entry.name;
  const metadataPath = resolve(metadataDirectory, `${collection}.json`);
  const previousOrder = getPreviousOrder(metadataPath);
  const items = collectMarkdownFiles(resolve(contentDirectory, collection))
    .map((filePath) => {
      const source = readFileSync(filePath, "utf8");
      const { frontmatter, body } = readFrontmatter(source, filePath);
      const id = requireString(frontmatter.id, "id", filePath);
      const itemCollection = requireString(
        frontmatter.collection,
        "collection",
        filePath,
      );
      if (itemCollection !== collection) {
        throw new Error(
          `Frontmatter collection "${itemCollection}" does not match "${collection}" in ${relative(rootDirectory, filePath)}`,
        );
      }

      const title = requireString(frontmatter.title, "title", filePath);
      const text = getPlainText(body);
      const item = {
        id,
        title,
        collection,
      };

      for (const field of ["author", "dynasty"]) {
        if (frontmatter[field] !== undefined) {
          item[field] = requireString(frontmatter[field], field, filePath);
        }
      }

      const date = normalizeDate(frontmatter.date, filePath);
      if (date !== undefined) item.date = date;
      if (frontmatter.tags !== undefined) {
        if (
          !Array.isArray(frontmatter.tags) ||
          !frontmatter.tags.every((tag) => typeof tag === "string")
        ) {
          throw new Error(
            `Expected "tags" to be an array of strings in ${relative(rootDirectory, filePath)}`,
          );
        }
        item.tags = frontmatter.tags;
      }

      item.path = relative(rootDirectory, filePath).split(sep).join("/");
      item.url = `/portfolio/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`;
      if (text) item.excerpt = createExcerpt(text);
      item.wordCount = countWords(text);

      return item;
    })
    .sort((left, right) => {
      const leftOrder = previousOrder.get(left.id) ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = previousOrder.get(right.id) ?? Number.MAX_SAFE_INTEGER;
      return leftOrder - rightOrder || left.id.localeCompare(right.id, "en");
    });

  const data = { collection, count: items.length, items };
  const timestamp = writeGeneratedJson(metadataPath, data, generatedAt);
  collections.push({
    key: collection,
    count: items.length,
    metaPath: relative(rootDirectory, metadataPath).split(sep).join("/"),
    contentDir: relative(rootDirectory, resolve(contentDirectory, collection))
      .split(sep)
      .join("/"),
    generatedAt: timestamp,
  });
  total += items.length;
}

const index = {
  total,
  collections: collections.map((collection) => ({
    key: collection.key,
    count: collection.count,
    metaPath: collection.metaPath,
    contentDir: collection.contentDir,
  })),
};
const latestTimestamp =
  collections
    .map((collection) => collection.generatedAt)
    .sort()
    .at(-1) ?? generatedAt;
writeGeneratedJson(
  resolve(metadataDirectory, "index.json"),
  index,
  latestTimestamp,
  false,
);

console.log(
  `Generated metadata for ${collections.length} collections (${total} items).`,
);
