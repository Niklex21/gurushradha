import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { InstagramPost, InstagramApiResponse } from "@/types";
import { actions } from "astro:actions";

export default function InstagramFeed({ limit = 5 }: { limit?: number }) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const accessToken = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN;

  const InstagramIcon = ({ className }: { className?: string }) => (
    <img
      src="https://cdn.simpleicons.org/instagram"
      alt="Instagram"
      width={24}
      height={24}
      className={className}
    />
  );

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const { data: response, error } = await actions.fetchInstagramPosts();

        if (!response || !response.ok) {
          throw new Error("Failed to fetch Instagram posts");
        }

        const data: InstagramApiResponse = await response.json();
        setPosts(data.data);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("An unknown error occurred");
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [accessToken, limit]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load Instagram feed: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 flex flex-col p-4">
      <div className="flex items-center gap-2">
        <InstagramIcon className="h-5 w-5" />
        <h2 className="text-2xl font-bold align-middle">
          Latest from Instagram
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? [...Array(limit)].map((_, i) => (
              <Skeleton
                className="h-64 w-full bg-gray-200 rounded-xl"
                key={i}
              />
            ))
          : posts.map((post) => <iframe src={post.permalink} key={post.id} />)}
      </div>
    </div>
  );
}
