<script lang="ts">
    import { getAlbumImages } from "$lib/api";
    import type { AlbumQuery } from "$lib/types";

    let albumCoversPromise: Promise<Promise<string>[]> = $state(Promise.resolve([]));
    let album: string = $state("");
    let artist: string = $state("");

    let query: AlbumQuery = $derived({
        name: album,
        artist: artist
    });

    const onclick = async () => {
        albumCoversPromise = getAlbumImages(query);
    }
</script>

<input type="text" name="album" placeholder="Album Name" bind:value={album} />
<input type="text" name="artist" placeholder="Artist" bind:value={artist} />
<button {onclick}>Update</button>

{#await albumCoversPromise}
    <p>Fetching images...</p>
{:then albumCovers}
    {#if albumCovers.length > 0}
        {#each albumCovers as albumCover}
            {#await albumCover}
                <p>Loading...</p>
            {:then coverImage}
                {#if coverImage}
                    <img src={coverImage} alt="Album Cover" />
                {/if}
            {/await}
        {/each}
    {:else}
        <p>No covers found!</p>
    {/if}
{:catch err: Error}
    <p>Error: {err.message}</p>
{/await}
