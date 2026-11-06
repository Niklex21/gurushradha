import type {
  AssetStoryblok,
  RichtextStoryblok,
  DirectorsStoryblok,
  EnsembleStoryblok,
  EventsStoryblok,
  HomeEventsStoryblok,
  HomeMainTextStoryblok,
  HomeTestimonialsStoryblok,
  InstagramFeedStoryblok,
  TestimonialsStoryblok,
  VisionStoryblok,
} from "@/component-types";
import type { SbBlokData } from "@storyblok/astro";

export interface RichContent extends SbBlokData {
  component: "rich_content";
  content?: RichtextStoryblok;
  image?: AssetStoryblok;
}

export interface SiteFooterContent extends SbBlokData {
  component: "site_footer";
  brand_name: string;
  copyright: string;
  donation_label: string;
  donation_url: string;
  newsletter_heading: string;
  newsletter_description: string;
  newsletter_button: string;
  newsletter_url: string;
  newsletter_privacy: string;
  navigation?: RichtextStoryblok;
  background_image?: AssetStoryblok;
}

// Editorial extensions to the existing generated component types.
export type EditableDirectors = DirectorsStoryblok & {
  board?: RichtextStoryblok;
};
export type EditableEnsemble = EnsembleStoryblok & { introduction: string };
export type EditableEvents = EventsStoryblok & {
  time_notice: string;
  past_heading: string;
};
export type EditableHomeEvents = HomeEventsStoryblok & {
  heading: string;
  view_all_label: string;
  empty_message: string;
};
export type EditableHomeMainText = HomeMainTextStoryblok & {
  donation_label: string;
  donation_url: string;
};
export type EditableHomeTestimonials = HomeTestimonialsStoryblok & {
  heading: string;
};
export type EditableInstagramFeed = InstagramFeedStoryblok & {
  heading: string;
  fallback_text: string;
  fallback_label: string;
  profile_url: string;
};
export type EditableTestimonials = TestimonialsStoryblok & {
  introduction: string;
  reviews_heading: string;
  testimonials_heading: string;
};
export type EditableVision = VisionStoryblok & {
  mission_label: string;
  vision_label: string;
};
