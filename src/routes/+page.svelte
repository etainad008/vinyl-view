<script lang="ts">
    const getAlbumMBID = async (album: string, artist:  string) => {
        const API_URI = `https://musicbrainz.org/ws/2/release/?query=release:"${album}" AND artist:"${artist}"&fmt=json`;

        const response = await fetch(API_URI);
        let data: any = await response.json();

        if (data.count < 1 || !data.releases || data.releases.length < 1)
        {
            return "Not found";
        }
        
        if (data.releases && data.releases.length > 0) {
            return data.releases.filter((entry: any) => {
                return entry.score >= 90;
            })[0].id;
        } else {
            return "No MBID found";
        }
    }

    const getAlbumCoverByMBID = async (albumMBID: string) => {
        const res = await fetch(`https://coverartarchive.org/release/${albumMBID}/`);
        let data: any = await res.json();
        return data.images[0].image;
    }

    let MBID: string = $state("");
    let image: string = $state("");
    
    const onclick = async () => {
        const albumMBID = await getAlbumMBID("The battle of los angeles", "Rage against the machine");
        MBID = albumMBID;

        const albumImage = await getAlbumCoverByMBID(albumMBID);
        image = albumImage;
    }
</script>

<button {onclick}>Update</button>
<h1>{MBID}</h1>
<img src={image} alt="Album Cover" />
