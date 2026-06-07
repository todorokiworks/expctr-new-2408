const SITE_URL = "https://expctr.com";

const SAME_AS = [
    "https://instagram.com/expctr",
    "https://twitter.com/expctr__",
    "https://www.youtube.com/@EXPCTR",
    "https://www.tiktok.com/@expctr",
    "https://music.apple.com/jp/artist/expctr/1438272153",
    "https://expctr.bandcamp.com/releases",
];

type MusicItem = {
    title: string;
    artist: string;
    link: string;
    image?: { url: string };
};

export function buildStructuredData(additionalGraph: Record<string, unknown>[] = []) {
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                name: "EXPCTR OFFICIAL WEBSITE",
                url: SITE_URL,
                publisher: { "@id": `${SITE_URL}/#musicgroup` },
            },
            {
                "@type": "MusicGroup",
                "@id": `${SITE_URL}/#musicgroup`,
                name: "EXPCTR",
                url: SITE_URL,
                description: "Japan-based SSW/Producer",
                image: `${SITE_URL}/img/headshot.png`,
                sameAs: SAME_AS,
            },
            ...additionalGraph,
        ],
    };
}

export function buildMusicAlbumGraph(items: MusicItem[]) {
    return items.map((item) => ({
        "@type": "MusicAlbum",
        name: item.title,
        byArtist: {
            "@type": "MusicGroup",
            "@id": `${SITE_URL}/#musicgroup`,
            name: item.artist,
        },
        url: item.link,
        ...(item.image?.url ? { image: item.image.url } : {}),
    }));
}
