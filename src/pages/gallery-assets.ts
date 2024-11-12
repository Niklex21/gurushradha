import StoryblokClient from "storyblok-js-client";

const STORYBLOK_CLIENT = new StoryblokClient({
    oauthToken: import.meta.env.STORYBLOK_OAUTH_TOKEN,
    region: "us",
});

const STORYBLOK_SPACE_ID = import.meta.env.STORYBLOK_SPACE_ID;

export async function GET({ params }: any) {
    const response = await STORYBLOK_CLIENT.get(
        `spaces/${STORYBLOK_SPACE_ID}/asset_folders/`,
        {
            with_parent: 19337, // gallery folder
        },
    );

    if (!response.data) {
        return new Response("Problem", { status: 500 });
    }

    return new Response(JSON.stringify(response.data), {
        headers: { "content-type": "application/json" },
    });
}
