/**
 * 读取项目根目录 meta/*.json 中生成的元数据（合集页 / 详情页使用）。
 *
 * 注意：Nuxt/Vite 会把 import.meta.glob("~~/meta/*.json") 的键规范化为相对srcDir 的路径（例如 "../meta/poems.json"），
 * 并不会保留编写时的"~~/meta/poems.json" 别名形式。
 * 因此不能直接以别名拼串作为下标去访问 glob 结果，这里统一按文件名兜底匹配，避免 key 格式差异导致加载失败。
 */
const metaFiles = import.meta.glob("~~/meta/*.json", {
  import: "default",
}) as Record<string, () => Promise<unknown>>;

const metaLoaders = new Map<string, () => Promise<unknown>>();

for (const [key, loader] of Object.entries(metaFiles)) {
  const fileName = key.split("/").pop();
  if (fileName && !metaLoaders.has(fileName)) {
    metaLoaders.set(fileName, loader);
  }
}

/**
 * 返回指定 meta 文件的加载函数；文件不存在时返回 undefined。
 *
 * @example usePortfolioMeta("poems.json")
 */
export function usePortfolioMeta(
  fileName: string,
): (() => Promise<unknown>) | undefined {
  return metaLoaders.get(fileName);
}