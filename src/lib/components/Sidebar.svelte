<script lang="ts">
    import ReleaseView from './ReleaseView.svelte';
    import ReleaseGrid from './ReleaseGrid.svelte';

    import { fade } from 'svelte/transition';
    import { pushState } from '$app/navigation';
    import { getAlbumReleases } from '$lib/api';
    import type { AlbumQuery, Album } from '$lib/types';
    import { page } from '$app/state';

    let albumReleasesPromise: Promise<Promise<Album>[]> = $state(Promise.resolve([]));
    let title: string = $state('');
    let artist: string = $state('');

    let query: AlbumQuery = $derived({
        title: title,
        artist: artist
    });

    const onclickSearch = async () => {
        albumReleasesPromise = getAlbumReleases(query);

        const url = new URL(page.url);
        url.searchParams.set('qtitle', query.title.trim());

        if (query.artist?.trim()) {
            url.searchParams.set('qartist', query.artist.trim());
        }

        pushState(url, { query: query });
    };

    const exitPreviewOnEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onclickExitCoverPreview();
        }
    };

    const onclickExitCoverPreview = () => {
        history.back();
        window.removeEventListener('keydown', exitPreviewOnEscape);
    };

    const onclickBack = () => {
        history.back();
    };
</script>

<div class="container">
    <aside class="sidebar">
        {#if page.state.release}
            <header>
                <h4>View Release</h4>
                <button class="back" onclick={onclickBack}>back</button>
            </header>
            <ReleaseView />
        {:else}
            <header>
                <h4>Search</h4>
            </header>

            <div class="search-input">
                <input type="text" name="album" placeholder="Album Title" bind:value={title} />
                <input type="text" name="artist" placeholder="Artist" bind:value={artist} />
                <button type="submit" onclick={onclickSearch}>search</button>
            </div>

            {#if page.state.query}
                <ReleaseGrid {albumReleasesPromise}/>
            {:else}
                <p>Start searching!</p>
            {/if}
        {/if}
    </aside>

    {#if page.state.coverPreview && page.state.release}
        <button
            class="cover-preview"
            onclick={onclickExitCoverPreview}
            transition:fade={{ duration: 75 }}
        >
            <img
                src={page.state.release.cover?.image}
                alt="{page.state.release.title}'s cover"
                role="{page.state.release.title}'s cover"
                onclick={(e: Event) => e.stopPropagation()}
            />
        </button>
        <!-- #I HAVE THE BEST DAD IN THE WORLD -->
    {/if}
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

    button,
    input {
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
        border-right: 1px solid rgba(0, 0, 0, 0.15);
        min-height: -webkit-fill-available;
    }

    .sidebar > header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-block: 1.25rem;
    }

    .search-input {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .search-input > input[type='text'] {
        border: none;
        outline: 1px solid rgba(0, 0, 0, 0.15);
        padding: 0.75rem;
        border-radius: 0 100vw 100vw 0;
    }

    .search-input > input[type='text']:is(:focus, :hover) {
        outline-color: springgreen;
    }

    .search-input > input[type='text']:-webkit-autofill {
        -webkit-background-clip: text;
    }

    .search-input > button[type='submit'] {
        border: none;
        background-color: springgreen;
        font-weight: 500;
        align-self: flex-start;
        max-width: fit-content;
        padding: 0.5rem 1rem;
        cursor: pointer;
    }

    .back {
        border: none;
        background-color: springgreen;
        padding: 0.5rem 1rem;
        cursor: pointer;
    }

    .cover-preview {
        position: absolute;
        width: 100vw;
        height: 100svh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.75);
        border: none;
        outline: none;
        cursor: pointer;
    }

    .cover-preview > img {
        width: clamp(20rem, 75vw, 75svh);
        aspect-ratio: 1 / 1;
        cursor: initial;
    }
</style>
