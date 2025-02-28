<script lang="ts">
    import { fade } from 'svelte/transition';
    import { pushState } from '$app/navigation';
    import type { Album } from '$lib/types';
    import { page } from '$app/state';

    let { albumReleasesPromise } = $props();

    const onclickRelease = (release: Album) => {
        const url = new URL(page.url);
        url.searchParams.set('release', release.id);
        pushState(url, { release: release });
    };
</script>

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
                            <img
                                src="https://coverartarchive.org/release/{release.id}/front-250"
                                alt="Album cover for {release.title}"
                                in:fade|global={{ duration: 100 }}
                            />
                            <button onclick={() => onclickRelease(release)}
                                >{release.title}</button
                            >
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

<style>
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

    button {
        font-family: 'Poppins', sans-serif;
    }

    .releases {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
        overflow-y: auto;
        max-height: 65%;
        padding-right: 0.5rem;
    }

    .releases::-webkit-scrollbar {
        background-color: transparent;
        width: 0.75rem;
    }

    .releases::-webkit-scrollbar-thumb {
        border-radius: 100vw;
        background-color: springgreen;
    }

    .release {
        display: grid;
        grid-template-areas: 'stack';
    }

    .release > button {
        opacity: 0;
        background-color: rgba(0, 0, 0, 0.8);
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
</style>
