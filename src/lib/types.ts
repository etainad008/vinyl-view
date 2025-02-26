export interface AlbumQuery {
    title: string;
    artist: string;
}

export type MBID = string;

export interface AlbumCover {
    id: string;
    approved: boolean;
    image: string;
    front: boolean;
}

export interface Album {
    id: MBID;
    title: string;
    artist: string;
    trackCount: number;
    releaseDate: string;
    cover?: AlbumCover;
}
