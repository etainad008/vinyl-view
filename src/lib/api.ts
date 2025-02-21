import type { AlbumQuery, MBID } from './types';

const getAlbumJSON = async (album: AlbumQuery) => {
	const API_URI = `https://musicbrainz.org/ws/2/release/?query=release:"${album.name}" AND artist:"${album.artist}"&fmt=json`;
	const res = await fetch(API_URI);

	return await res.json();
};

const getAlbumMBIDImp = async (album: AlbumQuery, maxAmount: number): Promise<MBID[]> => {
	if (!album.name) {
		throw Error('Album query must contain a non-empty album name');
	}

	if (maxAmount < 1) {
		throw Error('Amount must be positive');
	}

	const data = await getAlbumJSON(album);
	if (data.count < 1 || !data.releases || data.releases.length < 1) {
		return [];
	}

    return data.releases
        .toSorted((first: any, second: any) => second.score - first.score)
        .slice(0, maxAmount)
        .map((release: any) => release.id);
};

const getAlbumImageByMBID = async (id: MBID): Promise<string> => {
	const res = await fetch(`https://coverartarchive.org/release/${id}`);
    if (!res.ok) {
        return Promise.resolve("");
    }

	const data: any = await res.json();
	return data.images
        .filter((image: any) => image.approved && image.front)
        .toSorted((image: any) => image.id)[0].image;
};

export const getAlbumImages = async (album: AlbumQuery): Promise<Promise<string>[]> => {
    const albumMBIDs: MBID[] = await getAlbumMBIDImp(album, 5);
    return albumMBIDs.map(getAlbumImageByMBID);
}
