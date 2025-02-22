<script lang="ts">
    import { getAlbumImages } from "$lib/api";
    import type { AlbumQuery } from "$lib/types";

    let albumCoversPromise: Promise<Promise<string>[]> = $state(Promise.resolve([]));
    let album: string = $state("");
    let artist: string = $state("");

    let query: AlbumQuery = $derived({
        title: album,
        artist: artist
    });

    const onclick = async () => {
        albumCoversPromise = getAlbumImages(query);
    }
</script>

<div class="container">
    <aside class="search">
        <h2>Search</h2>

        <div class="search-input">
            <input type="text" name="album" placeholder="Album Title" bind:value={album} />
            <input type="text" name="artist" placeholder="Artist" bind:value={artist} />
            <button type="submit" {onclick}>Search</button>
        </div>

        <div class="covers">
            {#await albumCoversPromise}
                <p>Getting images...</p>
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
                <p>{err.message}</p>
            {/await}
        </div>
    </aside>
    <main></main>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

    :root {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    :global(body) {
        font-family: 'Poppins', sans-serif;
        margin: 0;
        overflow: hidden;
    }

    button, input {
        font-family: 'Poppins', sans-serif;
    }

    .container {
        position: absolute;
        inset: 0;
        display: flex;
    }

    .search {
        width: clamp(20rem, 18vw, 40rem);
        padding: 1rem 2rem 1rem 1.5rem;
        border-right: 1px solid rgba(0, 0, 0, .15);
        min-height: -webkit-fill-available;
    }

    .search-input {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .search-input > input[type="text"] {
        border: none;
        outline: 1px solid rgba(0, 0, 0, .15);
        padding: .75rem;
        border-radius: 0 100vw 100vw 0;
    }

    .search-input > input[type="text"]:is(:focus, :hover) {
        outline-color: rgb(0, 125, 200);
    }

    .search-input > button[type="submit"] {
        border: none;
        background-color: rgb(0, 125, 200);
        color: white;
        font-weight: 500;
        border-radius: 0 100vw 100vw 0;
        align-self:flex-start;
        max-width: fit-content;
        padding: .5rem 1rem;
        cursor: pointer;
    }

    .covers {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: .5rem;
        overflow-y: auto;
        height: 65%;
        padding-right: .5rem;
    }

    .covers > img {
        width: 100%;
        aspect-ratio: 1 / 1;
    }

    main {
        padding: 2rem;
    }
</style>
