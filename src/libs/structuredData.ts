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

type VideoItem = {
    link: string;
    publishedAt?: string;
};

type YouTubeOEmbed = {
    title?: string;
    thumbnail_url?: string;
};

function normalizePath(pathname: string) {
    if (pathname === "/") {
        return "/";
    }

    return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function pageUrl(pathname: string) {
    return pathname === "/" ? `${SITE_URL}/` : `${SITE_URL}${normalizePath(pathname)}`;
}

export function extractYouTubeId(url: string) {
    const match = url.match(/(?:embed\/|v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match?.[1] ?? null;
}

async function fetchYouTubeMeta(videoId: string): Promise<YouTubeOEmbed | null> {
    try {
        const response = await fetch(
            `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
        );

        if (!response.ok) {
            return null;
        }

        return (await response.json()) as YouTubeOEmbed;
    } catch {
        return null;
    }
}

export function buildBreadcrumbGraph(pathname: string, pageName: string) {
    const path = normalizePath(pathname);
    const items = [
        {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/`,
        },
    ];

    if (path !== "/") {
        items.push({
            "@type": "ListItem",
            position: 2,
            name: pageName,
            item: pageUrl(pathname),
        });
    }

    return {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl(pathname)}#breadcrumb`,
        itemListElement: items,
    };
}

export function buildWebPageGraph(
    pathname: string,
    name: string,
    description: string,
) {
    return {
        "@type": "WebPage",
        "@id": `${pageUrl(pathname)}#webpage`,
        url: pageUrl(pathname),
        name,
        description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#musicgroup` },
        breadcrumb: { "@id": `${pageUrl(pathname)}#breadcrumb` },
    };
}

export function buildProfilePageGraph() {
    return {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/about/#profilepage`,
        url: `${SITE_URL}/about/`,
        name: "About EXPCTR",
        mainEntity: { "@id": `${SITE_URL}/#musicgroup` },
    };
}

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

export async function buildVideoObjectGraph(items: VideoItem[]) {
    const videos = await Promise.all(
        items.map(async (item) => {
            const videoId = extractYouTubeId(item.link);

            if (!videoId) {
                return null;
            }

            const meta = await fetchYouTubeMeta(videoId);
            const name = meta?.title ?? "EXPCTR Official Video";

            return {
                "@type": "VideoObject",
                name,
                description: `${name} by EXPCTR`,
                thumbnailUrl:
                    meta?.thumbnail_url ??
                    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                uploadDate: item.publishedAt,
                embedUrl: `https://www.youtube.com/embed/${videoId}`,
                contentUrl: `https://www.youtube.com/watch?v=${videoId}`,
            };
        }),
    );

    return videos.filter(
        (video): video is NonNullable<typeof video> => video !== null,
    );
}

export function buildPageStructuredData(
    pathname: string,
    title: string,
    description: string,
    additionalGraph: Record<string, unknown>[] = [],
) {
    const pageGraph: Record<string, unknown>[] = [
        buildWebPageGraph(pathname, title, description),
        buildBreadcrumbGraph(pathname, title),
    ];

    if (normalizePath(pathname) === "/about/") {
        pageGraph.push(buildProfilePageGraph());
    }

    return buildStructuredData([...pageGraph, ...additionalGraph]);
}
