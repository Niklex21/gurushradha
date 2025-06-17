export type GalleryData = {
  asset_folders: {
    id: number;
    name: string;
    parent_id: number;
    uuid: string;
    parent_uuid: string | null;
  }[];
};

export type Asset = {
  id: number;
  filename: string;
  space_id: number;
  created_at: string;
  updated_at: string;
  file: object;
  asset_folder_id: number;
  deleted_at?: string;
  short_filename: string;
  content_type: string;
  content_length: number;
  alt: string;
  copyright: string;
  title: string;
  source: string;
  expire_at?: string;
  focus?: string;
  internal_tag_ids: string[];
  internal_tags_list: {
    id: number;
    name: string;
  }[];
  locked: boolean;
  publish_at: string | null;
  is_private: boolean;
  meta_data: object;
};

export interface InstagramPost {
  permalink: string;
  id: string;
  caption: string;
  media_url: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  thumbnail_url?: string;
  children?: InstagramChildPost[];
}

export interface InstagramChildPost {
  id: string;
  media_type: "IMAGE" | "VIDEO";
  media_url: string;
  thumbnail_url?: string;
}

export interface InstagramApiResponse {
  data: InstagramPost[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
    next: string;
  };
}
