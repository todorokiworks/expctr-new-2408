import { createClient, type MicroCMSQueries } from "microcms-js-sdk";

const client = createClient({
    serviceDomain: "expctr",
    apiKey: "2M8MtzcG3YTGwxY91bPuTGGiVPIWHgc9mwDU",
});

export const getMusic = async (queries: MicroCMSQueries) => {
    return await client.get({ endpoint: "music", queries });
}

export const getLatestMusic = async (queries: MicroCMSQueries) => {
    return await client.get({ endpoint: "music", queries });
}

export const getMusicVideo = async (queries: MicroCMSQueries) => {
    return await client.get({ endpoint: "musicvideo", queries });
}

