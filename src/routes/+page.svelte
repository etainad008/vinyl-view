<script lang="ts">
    import { getAlbumImages } from "$lib/api";
    import type { AlbumQuery } from "$lib/types";

    let images: string[] = $state([]);
    
    const onclick = async () => {
        const query: AlbumQuery = {
            name: "Repentless",
            artist: "Slayer"
        };

        images = await getAlbumImages(query);
    }
</script>

<button {onclick}>Update</button>
{#each images as image}
    <img src={image} alt="Album Cover" />
{/each}
