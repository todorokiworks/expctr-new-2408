import { createClient, type MicroCMSQueries } from "microcms-js-sdk";

const serviceDomain = import.meta.env.SERVICE_DOMEIN;
const apiKey = import.meta.env.API_KEY;

if (!serviceDomain || !apiKey) {
    throw new Error(
        `Missing required environment variables: SERVICE_DOMEIN=${!!serviceDomain}, API_KEY=${!!apiKey}`
    );
}

const client = createClient({
    serviceDomain,
    apiKey,
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