import type { GalleryPhotoshootStoryblok } from '@/component-types';
import { Skeleton } from './ui/skeleton';
import { useEffect, useState } from 'react';
import { GET as GetFolderAssets } from '@/pages/[folderId].folder-assets';
import type { Asset } from '@/types';
import {
    ChevronLeftIcon,
    ChevronRightCircleIcon,
    ChevronRightIcon,
    Loader2,
    XIcon,
} from 'lucide-react';
import { Button } from './ui/button';

type GalleryImageProps = {
    asset: Asset;
} & React.HTMLAttributes<HTMLImageElement>;

function GalleryImage({ asset, ...props }: GalleryImageProps) {
    return (
        <>
            <img
                loading="lazy"
                src={
                    asset.filename.replace('s3.amazonaws.com/', '') +
                    '/m/500x500/filters:quality(50)'
                }
                alt={asset.alt ?? 'image'}
                decoding="async"
                className="object-cover w-full h-full rounded-xl hover:brightness-90 cursor-pointer"
                {...props}
            />
        </>
    );
}

export default function GalleryEvent({
    event,
    folderId,
}: {
    event: GalleryPhotoshootStoryblok;
    folderId: number;
}) {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const [currentFullScreenIndex, setCurrentFullScreenIndex] = useState(-1);

    // if escape is pressed, close the full screen
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (currentFullScreenIndex === -1) {
                return;
            }

            if (e.key === 'Escape') {
                setCurrentFullScreenIndex(-1);
            } else if (e.key === 'ArrowRight') {
                setCurrentFullScreenIndex(
                    (currentFullScreenIndex + 1) % assets.length
                );
            } else if (e.key === 'ArrowLeft') {
                setCurrentFullScreenIndex(
                    (currentFullScreenIndex - 1 + assets.length) % assets.length
                );
            }
        };

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [currentFullScreenIndex]);

    useEffect(() => {
        async function fetchAssets() {
            setLoading(true);
            const response = await fetch(`/${folderId}.folder-assets`);
            setLoading(false);

            if (!response.ok) {
                setError(true);
                return;
            }

            const data = await response.json();

            setAssets(data.assets);
        }

        fetchAssets();
    }, []);

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-6 items-center">
                    <div className="hidden sm:flex w-3 h-3 rounded-full bg-gray-200" />
                    <span className="text-xl sm:text-3xl font-semibold text-gray-200">
                        {event.name}
                    </span>
                    <div className="hidden sm:flex w-20 bg-gray-200 h-[1px]" />
                    <span className="text-base text-gray-200 opacity-80">
                        {new Date(event.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </span>
                </div>
                <div className="flex flex-row gap-9">
                    <div className="hidden sm:flex w-9 relative">
                        <div className="absolute inset-y-0 left-[5.5px] w-[1px] bg-gray-200" />
                    </div>
                    <div className="w-full py-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {error ? (
                            <div className="col-span-full text-left text-gray-200 italic">
                                Error fetching images
                            </div>
                        ) : loading ? (
                            <Loader2 className="animate-spin 2-8 h-8 text-gray-200" />
                        ) : (
                            assets?.map((asset, index) => (
                                <GalleryImage
                                    asset={asset}
                                    key={index}
                                    onClick={() =>
                                        setCurrentFullScreenIndex(index)
                                    }
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
            {currentFullScreenIndex !== -1 && (
                <div
                    className="fixed h-dvh inset-0 z-50 bg-black bg-opacity-90 flex justify-center items-center object-contain"
                    onClick={() => setCurrentFullScreenIndex(-1)}
                >
                    <div className="flex relative max-h-full w-auto">
                        <img
                            loading={'lazy'}
                            src={
                                assets[currentFullScreenIndex].filename.replace(
                                    's3.amazonaws.com/',
                                    ''
                                ) + '/m/'
                            }
                            alt={assets[currentFullScreenIndex].alt ?? 'image'}
                            decoding="async"
                            className="relative max-h-full w-auto object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div
                            className="absolute top-0 right-0 p-4 cursor-pointer"
                            onClick={() => setCurrentFullScreenIndex(-1)}
                        >
                            <XIcon className="w-8 h-8 text-gray-200 hover:-rotate-180 duration-200 transition-all" />
                        </div>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 right-8">
                        <Button
                            className="p-4 bg-gray-200 bg-opacity-50 rounded-full hover:bg-gray-200"
                            onClick={(e) => {
                                setCurrentFullScreenIndex(
                                    (currentFullScreenIndex + 1) % assets.length
                                );
                                e.stopPropagation();
                            }}
                            size={'icon'}
                        >
                            <ChevronRightIcon />
                        </Button>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-8">
                        <Button
                            className="p-4 bg-gray-200 bg-opacity-50 rounded-full hover:bg-gray-200"
                            onClick={(e) => {
                                setCurrentFullScreenIndex(
                                    (currentFullScreenIndex + 1) % assets.length
                                );
                                e.stopPropagation();
                            }}
                            size={'icon'}
                        >
                            <ChevronLeftIcon />
                        </Button>
                    </div>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                        <span className="text-gray-200">
                            {event.name} - {currentFullScreenIndex + 1}/{assets.length}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
}
