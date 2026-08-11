type CacheTag = "domains";

export const getGlobalTag = (tag: CacheTag) => {
  return `global:${tag}` as const;
};

export const getIdTag = (id: string, tag: CacheTag) => {
  return `${tag}:${id}` as const;
};
