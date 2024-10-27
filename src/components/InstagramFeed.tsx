import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink } from 'lucide-react';
import {
    fetchInstagramPosts,
    type InstagramApiResponse,
    type InstagramPost,
} from '@/lib/instagram';
import Image from 'astro/components/Image.astro';

export default function InstagramFeed({
    instagramId,
    limit = 5,
}: {
    instagramId: string;
    limit?: number;
}) {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const accessToken = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN;

    const InstagramIcon = ({ className }: { className?: string }) => (
        <Image
            src="https://cdn.simpleicons.org/instagram"
            alt="Instagram"
            width={24}
            height={24}
            class={className}
        />
    );

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);

                const response = await fetchInstagramPosts(instagramId, limit);

                if (!response.ok) {
                    throw new Error('Failed to fetch Instagram posts');
                }

                const data: InstagramApiResponse = await response.json();
                setPosts(data.data);
            } catch (err) {
                const error =
                    err instanceof Error
                        ? err
                        : new Error('An unknown error occurred');
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [accessToken, limit]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(limit)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        <CardContent className="p-0">
                            <Skeleton className="h-64 w-full" />
                            <div className="p-4">
                                <Skeleton className="h-4 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

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
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <InstagramIcon className="h-5 w-5" />
                <h2 className="text-2xl font-bold">Latest from Instagram</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                    <Card key={post.id} className="overflow-hidden group">
                        <CardContent className="p-0">
                            <div className="relative">
                                <img
                                    src={
                                        post.media_type === 'VIDEO'
                                            ? post.thumbnail_url
                                            : post.media_url
                                    }
                                    alt={
                                        post.caption?.slice(0, 100) ||
                                        'Instagram post'
                                    }
                                    className="w-full h-64 object-cover"
                                />
                                <a
                                    href={post.permalink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center"
                                >
                                    <ExternalLink className="text-white opacity-0 group-hover:opacity-100 h-6 w-6" />
                                </a>
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-gray-600 line-clamp-3">
                                    {post.caption || 'No caption'}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                    {new Date(
                                        post.timestamp
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
