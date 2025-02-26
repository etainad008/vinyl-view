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
    };

    const onclickRelease = (release: Album) => {
        viewedRelease = release;

        const url = new URL(window.location.href);
        url.searchParams.set("release", release.id);
        window.history.pushState(null, "", url.toString());

        sidebarViewStack.push("release");
    };

    const onclickBack = () => {
        if (sidebarViewStack.length > 1) {
            const currentState: string = sidebarViewStack.pop() as string;
            if (currentState == "release") {
                const url = new URL(window.location.href);
                url.searchParams.delete("release");
                window.history.pushState(null, "", url.toString());
            }
        }
    };

    const onclickDownload = async (release: Album) => {
        const res = await fetch(release.cover?.image as string);
        const blob = await res.blob();
        const window_url = window.URL || window.webkitURL;
        const link = window_url.createObjectURL(blob);

        const image_name: string = new URL(release.cover?.image as string).pathname.split('/').pop() as string;
        let a = document.createElement("a");
        a.setAttribute("download", image_name);
        a.setAttribute("href", link);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const onclickCopy = async (release: Album) => {
        await window.navigator.clipboard.writeText(release.id);
    };

    const onclickShare = async () => {
        await window.navigator.clipboard.writeText(window.location.toString());
    };
</script>

<div class="container">
    <aside class="sidebar">
        {#if currentSidebarView == "search"}
            <header>
                <h3>Search</h3>
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
                <h3>View Release</h3>
                <button class="back" onclick={onclickBack}>back</button>
            </header>

            <img src={viewedRelease?.cover?.image} alt={viewedRelease?.title} class="release-image" />
            <div class="release-controls">
                <button class="add" aria-label="Add">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.25 12.75V18H12.75V12.75H18V11.25H12.75V6H11.25V11.25H6V12.75H11.25Z" />
                    </svg>
                </button>
                <button class="download" aria-label="Download" onclick={() => onclickDownload(viewedRelease as Album)}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 15.9853L15.182 12.8033L14.1213 11.7427L12.75 13.114L12.75 5.25L11.25 5.25L11.25 13.114L9.8787 11.7427L8.81804 12.8033L12 15.9853ZM12 13.864L12 13.864L12.0001 13.864L12 13.864Z" />
                        <path d="M18 17.25L18 18.75L6 18.75L6 17.25L18 17.25Z" />
                    </svg>
                </button>
                <button class="share" aria-label="Share" onclick={onclickShare}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.6875 3.75C8.96439 3.75 7.5 5.23565 7.5 7.15385L7.5 15.4615C7.5 18.1444 9.55201 20.25 12 20.25C14.448 20.25 16.5 18.1444 16.5 15.4615V7.15385H18V15.4615C18 18.8963 15.351 21.75 12 21.75C8.649 21.75 6 18.8963 6 15.4615L6 7.15385C6 4.48383 8.06137 2.25 10.6875 2.25C13.3136 2.25 15.375 4.48383 15.375 7.15385V15.4615C15.375 17.3669 13.9013 18.9808 12 18.9808C10.0987 18.9808 8.625 17.3669 8.625 15.4615V7.15385H10.125V15.4615C10.125 16.615 11.0018 17.4808 12 17.4808C12.9982 17.4808 13.875 16.615 13.875 15.4615V7.15385C13.875 5.23565 12.4106 3.75 10.6875 3.75Z" />
                    </svg>
                </button>
                <button class="copy" aria-label="Copy" onclick={() => onclickCopy(viewedRelease as Album)}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.5 16.5L19.5 4.5L18.75 3.75H9L8.25 4.5L8.25 7.5L5.25 7.5L4.5 8.25V20.25L5.25 21H15L15.75 20.25V17.25H18.75L19.5 16.5ZM15.75 15.75L15.75 8.25L15 7.5L9.75 7.5V5.25L18 5.25V15.75H15.75ZM6 9L14.25 9L14.25 19.5L6 19.5L6 9Z" />
                    </svg>
                </button>
            </div>

            <div class="release-info">
                <div>
                    <h1 class="release-title">{viewedRelease?.title}</h1>
                    <h3 class="release-artist">{viewedRelease?.artist}</h3>
                </div>
            </div>
        {/if}
    </aside>
    <main></main>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

    :global(:root, *) {
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
        margin-block: 1.25rem;
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
        width: .75rem;
    }

    .releases::-webkit-scrollbar-thumb {
        border-radius: 100vw;
        background-color: springgreen;
    }

    .release {
        display: grid;
        grid-template-areas: "stack";
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

    .release > button:is(:hover, :focus, :active) {
        opacity: 1;
    }

    .release > img {
        grid-area: stack;
        max-width: 100%;
        aspect-ratio: 1 / 1;
        object-fit: cover;
    }

    .release-controls {
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        gap: .5rem;
    }

    .release-controls > button {
        display: flex;
        width: 1.75rem;
        aspect-ratio: 1 / 1;
        background-color: transparent;
        border: none;
        cursor: pointer;
    }
    
    .release-controls > button > svg {
        fill: rgb(90, 90, 90);
    }

    .release-controls > button:hover > svg {
        background-color: springgreen;
        fill: black;
    }

    .release-controls > button:first-child {
        width: 2.25rem;
        margin-right: auto;
    }

    .release-controls > button:first-child > svg {
        fill: black;
    }

    .release-info {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-top: 1rem;
    }

    .release-image {
        width: 100%;
    }

    .release-artist {
        font-weight: 400;
        color: rgb(90, 90, 90);
    }

    main {
        padding: 2rem;
    }
</style>
