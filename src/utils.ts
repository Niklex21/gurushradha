import {
  useStoryblokApi,
  type ISbContentMangmntAPI,
  type ISbResult,
  type ISbStories,
  type ISbStoriesParams,
  type ISbStory,
  type ISbStoryData,
  type ISbStoryParams,
} from "@storyblok/astro";
import type { MultilinkStoryblok } from "./component-types";

const storyblokApi = useStoryblokApi();
const VERSION = import.meta.env.DEV ? "draft" : "published";

export const useStoryblokGet = async (
  slug: string,
  params?: ISbStoriesParams,
  fetchOptions?: any,
): Promise<ISbResult> => {
  return await storyblokApi.get(
    slug,
    {
      version: VERSION,
      resolve_relations: [
        "global_reference.reference",
        "global_reference.reference.reference",
      ],
      ...params,
    },
    fetchOptions,
  );
};

export const useStoryblokGetAll = async (
  slug: string,
  params?: ISbStoriesParams,
  entity?: string,
  fetchOptions?: any,
): Promise<any[]> => {
  return await storyblokApi.getAll(
    slug,
    {
      version: VERSION,
      resolve_relations: "global_reference.reference",
      ...params,
    },
    entity,
    fetchOptions,
  );
};

interface ISbResponseData {
  link_uuids: string[];
  links: string[];
  rel_uuids?: string[];
  rels: any;
  story: ISbStoryData;
  stories: Array<ISbStoryData>;
}

export const useStoryblokPost = async (
  slug: string,
  params?: ISbStoriesParams | ISbContentMangmntAPI,
  fetchOptions?: any,
): Promise<ISbResponseData> => {
  return await storyblokApi.post(
    slug,
    {
      version: VERSION,
      resolve_relations: "global_reference.reference",
      ...params,
    },
    fetchOptions,
  );
};

export const useStoryblokPut = async (
  slug: string,
  params?: ISbStoriesParams | ISbContentMangmntAPI,
  fetchOptions?: any,
): Promise<ISbResponseData> => {
  return await storyblokApi.put(
    slug,
    {
      version: VERSION,
      ...params,
    },
    fetchOptions,
  );
};

export const useStoryblokDelete = async (
  slug: string,
  params?: ISbStoriesParams | ISbContentMangmntAPI,
  fetchOptions?: any,
): Promise<ISbResponseData> => {
  return await storyblokApi.delete(
    slug,
    {
      version: VERSION,
      ...params,
    },
    fetchOptions,
  );
};

export const useStoryblokGetStories = async (
  params?: ISbStoriesParams,
  fetchOptions?: any,
): Promise<ISbStories> => {
  return await storyblokApi.getStories(
    {
      version: VERSION,
      resolve_relations: "global_reference.reference",
      ...params,
    },
    fetchOptions,
  );
};

export const useStoryblokGetStory = async (
  slug: string,
  params?: ISbStoryParams,
  fetchOptions?: any,
): Promise<ISbStory> => {
  return await storyblokApi.getStory(
    slug,
    {
      version: VERSION,
      resolve_relations: "global_reference.reference",
      ...params,
    },
    fetchOptions,
  );
};

export const getHref = (link: MultilinkStoryblok) => {
  return link.linktype === "story" ? link.cached_url : link.url;
};
