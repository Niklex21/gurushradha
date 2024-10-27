export type GalleryData = {
    asset_folders: {
        id: number;
        name: string;
        parent_id: number;
        uuid: string;
        parent_uuid: string | null;
    }[];
};