// This file was generated by the storyblok CLI.
// DO NOT MODIFY THIS FILE BY HAND.
import type { ISbStoryData } from "storyblok";
export interface BulletPointStoryblok {
  text: string;
  component: "bullet_point";
  _uid: string;
  [k: string]: any;
}

export interface AssetStoryblok {
  alt: string | null;
  copyright?: string | null;
  fieldtype: "asset";
  id: number;
  filename: string | null;
  name: string;
  title: string | null;
  focus: string | null;
  meta_data?: {
    [k: string]: any;
  };
  source?: string | null;
  is_external_url?: boolean;
  is_private?: boolean;
  src?: string;
  updated_at?: string;
  width?: number | null;
  height?: number | null;
  aspect_ratio?: number | null;
  public_id?: string | null;
  content_type?: string;
  [k: string]: any;
}

export interface EventStoryblok {
  name: string;
  location?: string;
  date?: string;
  image: AssetStoryblok;
  description?: string;
  component: "event";
  _uid: string;
  [k: string]: any;
}

export interface EventsStoryblok {
  events: EventStoryblok[];
  component: "events";
  _uid: string;
  [k: string]: any;
}

export interface GalleryPhotoshootStoryblok {
  name?: string;
  folder_name: string;
  date: string;
  component: "gallery_photoshoot";
  _uid: string;
  [k: string]: any;
}

export interface GlobalStoryblok {
  global?: (
    | BulletPointStoryblok
    | EventStoryblok
    | EventsStoryblok
    | GalleryPhotoshootStoryblok
    | GlobalStoryblok
    | GlobalReferenceStoryblok
    | HeroStoryblok
    | HomeMainTextStoryblok
    | HomeTestimonialStoryblok
    | HomeTestimonialsStoryblok
    | InstagramFeedStoryblok
    | MenuItemStoryblok
    | NavbarStoryblok
    | PageStoryblok
    | SectionStoryblok
    | SocialLinkStoryblok
    | TestimonialStoryblok
    | TestimonialsStoryblok
    | VisionStoryblok
  )[];
  component: "global";
  _uid: string;
  [k: string]: any;
}

export interface GlobalReferenceStoryblok {
  reference?: any[];
  component: "global_reference";
  _uid: string;
  [k: string]: any;
}

export type MultilinkStoryblok =
  | {
      fieldtype: "multilink";
      id: string;
      url: string;
      cached_url: string;
      target?: "_blank" | "_self";
      anchor?: string;
      rel?: string;
      title?: string;
      prep?: string;
      linktype: "story";
      story?: {
        name: string;
        created_at?: string;
        published_at?: string;
        id: number;
        uuid: string;
        content?: {
          [k: string]: any;
        };
        slug: string;
        full_slug: string;
        sort_by_date?: null | string;
        position?: number;
        tag_list?: string[];
        is_startpage?: boolean;
        parent_id?: null | number;
        meta_data?: null | {
          [k: string]: any;
        };
        group_id?: string;
        first_published_at?: string;
        release_id?: null | number;
        lang?: string;
        path?: null | string;
        alternates?: any[];
        default_full_slug?: null | string;
        translated_slugs?: null | any[];
        [k: string]: any;
      };
      [k: string]: any;
    }
  | {
      fieldtype: "multilink";
      id: string;
      url: string;
      cached_url: string;
      target?: "_blank" | "_self";
      linktype: "url";
      rel?: string;
      title?: string;
      [k: string]: any;
    }
  | {
      fieldtype: "multilink";
      id: string;
      url: string;
      cached_url: string;
      target?: "_blank" | "_self";
      email?: string;
      linktype: "email";
      [k: string]: any;
    }
  | {
      fieldtype: "multilink";
      id: string;
      url: string;
      cached_url: string;
      target?: "_blank" | "_self";
      linktype: "asset";
      [k: string]: any;
    };

export interface HeroStoryblok {
  video_url: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  component: "hero";
  _uid: string;
  [k: string]: any;
}

export interface HomeMainTextStoryblok {
  headline: string;
  call_to_action: string;
  donate_link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  bullet_points?: BulletPointStoryblok[];
  component: "home_main_text";
  _uid: string;
  [k: string]: any;
}

export interface HomeTestimonialStoryblok {
  text: string;
  person_name: string;
  relation_to_gs?: string;
  component: "home_testimonial";
  _uid: string;
  [k: string]: any;
}

export interface HomeTestimonialsStoryblok {
  testimonials: HomeTestimonialStoryblok[];
  component: "home_testimonials";
  _uid: string;
  [k: string]: any;
}

export interface InstagramFeedStoryblok {
  instagram_id: string;
  limit: string;
  component: "instagram_feed";
  _uid: string;
  [k: string]: any;
}

export interface MenuItemStoryblok {
  name: string;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  submenus?: MenuItemStoryblok[];
  component: "menu_item";
  _uid: string;
  [k: string]: any;
}

export interface NavbarStoryblok {
  logo: AssetStoryblok;
  menu_items: MenuItemStoryblok[];
  social_links?: SocialLinkStoryblok[];
  logo_text: AssetStoryblok;
  component: "navbar";
  _uid: string;
  [k: string]: any;
}

export interface PageStoryblok {
  body?: (
    | BulletPointStoryblok
    | EventStoryblok
    | EventsStoryblok
    | GalleryPhotoshootStoryblok
    | GlobalStoryblok
    | GlobalReferenceStoryblok
    | HeroStoryblok
    | HomeMainTextStoryblok
    | HomeTestimonialStoryblok
    | HomeTestimonialsStoryblok
    | InstagramFeedStoryblok
    | MenuItemStoryblok
    | NavbarStoryblok
    | PageStoryblok
    | SectionStoryblok
    | SocialLinkStoryblok
    | TestimonialStoryblok
    | TestimonialsStoryblok
    | VisionStoryblok
  )[];
  events?: GalleryPhotoshootStoryblok[];
  sections?: SectionStoryblok[];
  component: "page";
  _uid: string;
  [k: string]: any;
}

export interface SectionStoryblok {
  asset?: AssetStoryblok;
  text?: string;
  component: "section";
  _uid: string;
  [k: string]: any;
}

export interface SocialLinkStoryblok {
  type: "facebook" | "instagram" | "youtube" | "tiktok";
  link: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  component: "social_link";
  _uid: string;
  [k: string]: any;
}

export interface TestimonialStoryblok {
  person_name: string;
  quote: string;
  relation_to_gs: string;
  type?: "" | "review" | "testimonial";
  component: "testimonial";
  _uid: string;
  [k: string]: any;
}

export interface TestimonialsStoryblok {
  testimonials?: TestimonialStoryblok[];
  component: "testimonials";
  _uid: string;
  [k: string]: any;
}

export interface VisionStoryblok {
  headline: string;
  mission: string;
  our_vision: string;
  mission_image: AssetStoryblok;
  vision_image: AssetStoryblok;
  component: "vision";
  _uid: string;
  [k: string]: any;
}
