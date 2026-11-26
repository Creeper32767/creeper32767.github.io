import { computed, toValue, type MaybeRefOrGetter } from "vue";

/** meta/<collection>.json 中的单篇作品条目 */
export interface PortfolioMetaItem {
  id: string;
  title: string;
  collection: string;
  author?: string;
  dynasty?: string;
  date?: string;
  tags?: string[];
  excerpt?: string;
  wordCount?: number;
  path?: string;
  url: string;
}

/** meta/<collection>.json 的整体结构 */
export interface PortfolioCollectionMeta {
  collection: string;
  count: number;
  generatedAt?: string;
  items: PortfolioMetaItem[];
}

/** 侧边栏目录使用的条目结构 */
export interface PortfolioPassage {
  id: string;
  title: string;
  url: string;
}

/** 详情页“作品信息”区块的字段 key */
export type PortfolioMetadataFieldKey = "author" | "dynasty" | "date";

/** 详情页“作品信息”区块的单个字段 */
export interface PortfolioMetadataField {
  label: PortfolioMetadataFieldKey;
  value: string;
}

interface PortfolioPassageSource {
  id: string;
  title: string;
}

/**
 * 读取项目根目录 meta/*.json 中生成的元数据（合集页 / 详情页）。
 *
 * 注意：Nuxt/Vite 会把 import.meta.glob("~~/meta/*.json") 的键规范化为相对 srcDir 的路径（例如 "../meta/poems.json"），
 * 并不会保留编写时的 "~~/meta/poems.json" 别名形式。
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

/** 加载指定合集的元数据文件（meta/<collection>.json）。 */
export async function loadPortfolioCollectionMeta(
  collection: string,
): Promise<PortfolioCollectionMeta> {
  const loader = usePortfolioMeta(`${collection}.json`);
  if (!loader) throw new Error(`Collection not found: ${collection}`);
  return (await loader()) as PortfolioCollectionMeta;
}

/**
 * 合集页与详情页共用的元数据加载器，内部使用 useAsyncData 处理 SSR 与缓存。
 *
 * @example const { data, error } = await usePortfolioCollectionMeta(collection);
 */
export function usePortfolioCollectionMeta(
  collection: MaybeRefOrGetter<string>,
) {
  return useAsyncData<PortfolioCollectionMeta>(
    () => `portfolio-meta-${toValue(collection)}`,
    () => loadPortfolioCollectionMeta(toValue(collection)),
    { watch: [() => toValue(collection)] },
  );
}

/** 合集标题（i18n） */
export function usePortfolioCollectionTitle(
  collection: MaybeRefOrGetter<string>,
) {
  const { t } = useI18n();
  return computed(() =>
    t(`portfolio.collections.${toValue(collection)}.title`),
  );
}

/** 把作品条目转换为侧边栏目录使用的条目（考虑链接本地化）。 */
export function usePortfolioPassages(
  collection: MaybeRefOrGetter<string>,
  items: MaybeRefOrGetter<
    ReadonlyArray<PortfolioPassageSource> | null | undefined
  >,
) {
  const localePath = useLocalePath();

  return computed<PortfolioPassage[]>(() => {
    const collectionValue = toValue(collection);
    return (toValue(items) ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      url: localePath(
        `/portfolio/${collectionValue}/${encodeURIComponent(item.id)}`,
      ),
    }));
  });
}

/** 读取正文 frontmatter 中的 tags（过滤掉非字符串项）。 */
export function usePortfolioTags(page: MaybeRefOrGetter<unknown>) {
  return computed<string[]>(() => {
    const value = (toValue(page) as { tags?: unknown } | null | undefined)
      ?.tags;
    return Array.isArray(value)
      ? value.filter((tag): tag is string => typeof tag === "string")
      : [];
  });
}

/** 标签文案翻译，缺少对应翻译时回退为原始标签。 */
export function usePortfolioTagLabel() {
  const { t, te } = useI18n();

  return (tag: string) => {
    const key = `portfolio.tags.${tag}`;
    return te(key) ? t(key) : tag;
  };
}

/** 从正文 frontmatter 提取详情页“作品信息”区块的字段。 */
export function usePortfolioItemMetadata(page: MaybeRefOrGetter<unknown>) {
  return computed<PortfolioMetadataField[]>(() => {
    const value = toValue(page) as
      | { author?: unknown; dynasty?: unknown; date?: unknown }
      | null
      | undefined;
    const result: PortfolioMetadataField[] = [];

    if (typeof value?.author === "string") {
      result.push({ label: "author", value: value.author });
    }
    if (typeof value?.dynasty === "string") {
      result.push({ label: "dynasty", value: value.dynasty });
    }

    const date =
      value?.date instanceof Date
        ? value.date.toISOString().slice(0, 10)
        : typeof value?.date === "string"
          ? value.date
          : undefined;
    if (date) result.push({ label: "date", value: date });

    return result;
  });
}
