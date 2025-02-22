import type { AlbumQuery, Album, AlbumCover } from './types';

const MAX_COVER_AMOUNT = 25;

const parseAlbumData = (data: any): Album[] => {
	return data.map((release: any) => {
		return {
			id: release.id,
			title: release.title,
			artist: release["artist-credit"][0].name,
			trackCount: release["track-count"],
			releaseDate: release.date
		} as Album;
	});
};

const getAlbumJSON = async (album: AlbumQuery) => {
	const API_URI = `https://musicbrainz.org/ws/2/release/?query=release:"${encodeURIComponent(album.title)}" AND artist:"${encodeURIComponent(album.artist)}"&fmt=json`;
	const res = await fetch(API_URI);

	return await res.json();
};

const getAlbumReleasesImp = async (album: AlbumQuery, maxAmount: number): Promise<Album[]> => {
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

const tryGetReleaseCover = async (album: Album): Promise<Album> => {
	const res = await fetch(`https://coverartarchive.org/release/${album.id}`);
	if (!res.ok) {
		album.cover = undefined;
		return album;
	}

	const data: any = await res.json();
	data.images = data.images.filter((image: any) => image.approved && image.front);
	if (data.images.length < 1) {
		// no approved images
		album.cover = undefined;
		return album;
	}

	// we need to be consistent with our choices of images
	// in case the API retrieves them in a different order
	data.images.sort((image: any) => image.id);

	const chosenImage = data.images[0];
	album.cover = {
		id: chosenImage.id,
		approved: chosenImage.approved,
		image: chosenImage.image,
		front: chosenImage.front
	};

	return album;
};

export const getAlbumReleases = async (album: AlbumQuery): Promise<Promise<Album>[]> => {
	const albumReleases: Album[] = await getAlbumReleasesImp(album, 6);
	return albumReleases.map(tryGetReleaseCover);
};
