export interface InstagramPost {
    id: string;
    caption?: string;
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    media_url: string;
    permalink: string;
    thumbnail_url?: string;
    timestamp: string;
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

export const fetchInstagramPosts = async (instagramId: string, limit = 5) => {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    return await fetch(
        `https://graph.instagram.com/v21.0/${instagramId}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}&limit=${limit}`
    );
};
