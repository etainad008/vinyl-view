const getAlbumMBID = async (album: string, artist: string): Promise<string | null> => {
	const API_URI = `https://musicbrainz.org/ws/2/release/?query=release:"${album}" AND artist:"${artist}"&fmt=json`;

	const response = await fetch(API_URI);
	const data: any = await response.json();

	if (data.count < 1 || !data.releases || data.releases.length < 1) {
		return null;
	}

    return data.releases.toSorted((first: any, second: any) => second.score - first.score)[0].id;
};

const getAlbumImageByMBID = async (albumMBID: string | null): Promise<string | null> => {
    if (!albumMBID) {
        return null;
    }

	const res = await fetch(`https://coverartarchive.org/release/${albumMBID}/`);
	const data: any = await res.json();

	return data.images[0].image;
};

export const getAlbumImage = async (album: string, artist: string): Promise<string | null> => {
    const albumMBID: string | null = await getAlbumMBID(album, artist);
    return await getAlbumImageByMBID(albumMBID);
}
