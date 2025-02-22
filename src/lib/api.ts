import type { AlbumQuery, MBID, Album } from './types';

const MAX_COVER_AMOUNT = 25;

const parseAlbumData = (data: any): Album[] => {
	return data.map((release: any) => {
		return {
			id: release.id,
			name: release.title,
			artist: release["artist-credit"][0].name,
			trackCount: release["track-count"],
			releaseDate: release.date
		} as Album;
	});
};

const getAlbumJSON = async (album: AlbumQuery) => {
	const API_URI = `https://musicbrainz.org/ws/2/release/?query=release:"${album.title}" AND artist:"${album.artist}"&fmt=json`;
	const res = await fetch(API_URI);

	return await res.json();
};

const getAlbumReleases = async (album: AlbumQuery, maxAmount: number): Promise<Album[]> => {
	if (!album.title) {
		throw Error('Album query must contain a non-empty album title');
	}

	if (maxAmount < 1) {
		throw Error('Amount must be positive');
	}

	const data = await getAlbumJSON(album);
	if (data.count < 1 || !data.releases || data.releases.length < 1) {
		return [];
	}

	return parseAlbumData(
		data.releases
			.toSorted((first: any, second: any) => second.score - first.score)
			.slice(0, maxAmount)
	);
};

const getAlbumImage = async (album: Album): Promise<string> => {
	const res = await fetch(`https://coverartarchive.org/release/${album.id}`);
    if (!res.ok) {
        return Promise.resolve("");
    }

	const data: any = await res.json();
	return data.images
        .filter((image: any) => image.approved && image.front)
        .toSorted((image: any) => image.id)[0].image;
};

export const getAlbumImages = async (album: AlbumQuery): Promise<Promise<string>[]> => {
    const albumReleases: Album[] = await getAlbumReleases(album, 1);
    return albumReleases.map(getAlbumImage);
}
