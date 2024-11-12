import StoryblokClient from "storyblok-js-client";

const STORYBLOK_CLIENT = new StoryblokClient({
    oauthToken: import.meta.env.STORYBLOK_OAUTH_TOKEN,
    region: "us",
});

const STORYBLOK_SPACE_ID = import.meta.env.STORYBLOK_SPACE_ID;

/**
 * An API endpoint that returns a list of assets in a folder.
 */
export async function GET({ params }: any) {
    const response = await STORYBLOK_CLIENT.get(
        `spaces/${STORYBLOK_SPACE_ID}/assets/`,
        {
            in_folder: params.folderId,
        },
    );

    if (!response.data) {
        return new Response("Problem", { status: 500 });
    }

    return new Response(JSON.stringify(response.data), {
        headers: { "content-type": "application/json" },
    });
}
