export interface AlbumQuery {
    title: string;
    artist: string;
}

export type MBID = string;

export interface Album {
    id: MBID;
	name: string;
	artist: string;
	trackCount: number;
	releaseDate: string;
}
