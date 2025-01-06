import { createClient, type MicroCMSQueries } from "microcms-js-sdk";

const client = createClient({
    serviceDomain: import.meta.env.SERVICE_DOMEIN,
    apiKey: import.meta.env.API_KEY,
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

export const getNews = async (queries: MicroCMSQueries) => {
    return await client.get({ endpoint: "news", queries })
}