<script lang="ts">
    import { fade } from "svelte/transition";

    import { getAlbumReleases } from "$lib/api";
    import type { AlbumQuery, Album } from "$lib/types";

    let albumReleasesPromise: Promise<Promise<Album>[]> = $state(Promise.resolve([]));
    let album: string = $state("");
    let artist: string = $state("");

    let viewedRelease: Album | undefined = $state();
    let sidebarViewStack: string[] = $state(["search"]);
    let currentSidebarView: string = $derived(sidebarViewStack.at(-1) as string);

    let query: AlbumQuery = $derived({
        title: album,
        artist: artist
    });

    const onclick = async () => {
        albumReleasesPromise = getAlbumReleases(query);
    }

    const onclickRelease = (release: Album) => {
        viewedRelease = release;

        const url = new URL(window.location.href);
        url.searchParams.set("release", release.id);
        window.history.pushState(null, "", url.toString());

        sidebarViewStack.push("release");
    }

    const onclickBack = () => {
        if (sidebarViewStack.length > 1) {
            const currentState: string = sidebarViewStack.pop() as string;
            if (currentState == "release") {
                const url = new URL(window.location.href);
                url.searchParams.delete("release");
                window.history.pushState(null, "", url.toString());
            }
        }
    }
</script>

<div class="container">
    <aside class="sidebar">
        {#if currentSidebarView == "search"}
            <header>
                <h2>Search</h2>
            </header>

            <div class="search-input">
                <input type="text" name="album" placeholder="Album Title" bind:value={album} />
                <input type="text" name="artist" placeholder="Artist" bind:value={artist} />
                <button type="submit" {onclick}>search</button>
            </div>

            <div class="releases">
                {#await albumReleasesPromise}
                    <p>Getting images...</p>
                {:then albumReleases}
                    {#if albumReleases.length > 0}
                        {#each albumReleases as albumRelease (albumRelease)}
                            {#await albumRelease}
                                <p>Loading...</p>
                            {:then release}
                                {#if release.cover}
                                    <div class="release">
                                        <img src={release.cover.image} alt='Album cover for "{release.title}"' in:fade|global={{ duration: 100 }}  />
                                        <button onclick={() => onclickRelease(release)}>{release.title}</button>
                                    </div>
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
        {:else if currentSidebarView == "release"}
            <header>
                <h2>View Release</h2>
                <button class="back" onclick={onclickBack}>back</button>
            </header>

            <img src={viewedRelease?.cover?.image} alt={viewedRelease?.title} class="release-image" />

            <h4 class="release-title">{viewedRelease?.title}</h4>
            <h5 class="release-artist">{viewedRelease?.artist}</h5>
        {/if}
    </aside>
    <main></main>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

    :global(:root) {
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

    .sidebar {
        width: clamp(20rem, 18vw, 40rem);
        padding: 1rem 2rem 1rem 1.5rem;
        border-right: 1px solid rgba(0, 0, 0, .15);
        min-height: -webkit-fill-available;
    }

    .sidebar > header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .sidebar > header > button.back {
        border: none;
        background-color: springgreen;
        padding: .5rem 1rem;
        cursor: pointer;
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
        outline-color: springgreen;
    }

    .search-input > input[type="text"]:-webkit-autofill {
        -webkit-background-clip: text;
    }

    .search-input > button[type="submit"] {
        border: none;
        background-color: springgreen;
        font-weight: 500;
        align-self:flex-start;
        max-width: fit-content;
        padding: .5rem 1rem;
        cursor: pointer;
    }

    .releases {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: .5rem;
        overflow-y: auto;
        max-height: 65%;
        padding-right: .5rem;
    }

    .releases::-webkit-scrollbar {
        background-color: transparent;
    }

    .releases::-webkit-scrollbar-thumb {
        border-radius: 100vw;
        background-color: springgreen;
    }

    .release {
        display: grid;
        grid-template-areas: "stack";
        min-width: 100%;
        aspect-ratio: 1 / 1;
    }

    .release > button {
        opacity: 0;
        background-color: rgba(0, 0, 0, .8);
        color: white;
        font-weight: 500;
        grid-area: stack;
        border: none;
        padding: 0;
        cursor: pointer;

        transition: opacity 75ms ease-in;
    }

    .release > button:hover {
        opacity: 1;
    }

    .release > img {
        max-width: 100%;
        grid-area: stack;
        object-fit: cover;
    }

    .release-image {
        width: 100%;
    }

    main {
        padding: 2rem;
    }
</style>
