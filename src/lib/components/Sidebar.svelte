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
    let openArrow: boolean = $state(true);

    const handleArrowClick = () => {
        openArrow = !openArrow;
    };

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
    {#if openArrow}
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
                    <button onclick={handleArrowClick} aria-label="open menu" class="arrow-button">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            class="arrow-icon"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M6.3508 12.7499L11.2096 17.4615L10.1654 18.5383L3.42264 11.9999L10.1654 5.46148L11.2096 6.53833L6.3508 11.2499L21 11.2499L21 12.7499L6.3508 12.7499Z"
                            />
                        </svg>
                    </button>
                </header>

                <div class="search-input">
                    <input type="text" name="album" placeholder="Album Title" bind:value={title} />
                    <input type="text" name="artist" placeholder="Artist" bind:value={artist} />
                    <button type="submit" onclick={onclickSearch}>search</button>
                </div>

                {#if page.state.query}
                    <ReleaseGrid {albumReleasesPromise} />
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
    {:else}
        <aside class="close-sidebar">
            <div class="flex-column">
                <button onclick={handleArrowClick} aria-label="open menu" class="arrow-button">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="arrow-icon-extra"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M6.3508 12.7499L11.2096 17.4615L10.1654 18.5383L3.42264 11.9999L10.1654 5.46148L11.2096 6.53833L6.3508 11.2499L21 11.2499L21 12.7499L6.3508 12.7499Z"
                        />
                    </svg>
                </button>
                <div style="text-align: center;">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo">
                        <path
                            d="M12 12H12.01M7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V7.2C20 6.0799 20 5.51984 19.782 5.09202C19.5903 4.71569 19.2843 4.40973 18.908 4.21799C18.4802 4 17.9201 4 16.8 4H7.2C6.0799 4 5.51984 4 5.09202 4.21799C4.71569 4.40973 4.40973 4.71569 4.21799 5.09202C4 5.51984 4 6.07989 4 7.2V16.8C4 17.9201 4 18.4802 4.21799 18.908C4.40973 19.2843 4.71569 19.5903 5.09202 19.782C5.51984 20 6.07989 20 7.2 20ZM17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12ZM12.5 12C12.5 12.2761 12.2761 12.5 12 12.5C11.7239 12.5 11.5 12.2761 11.5 12C11.5 11.7239 11.7239 11.5 12 11.5C12.2761 11.5 12.5 11.7239 12.5 12Z"
            
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                    <p>bijo</p>
                </div>
            </div>
        </aside>
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

    .close-sidebar {
        padding: 1rem 0.3rem 1rem 0.3rem;
        border-right: 1px solid rgba(0, 0, 0, 0.15);
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

    .arrow-button {
        display: flex;
        border: none;
        background-color: transparent;
        cursor: pointer;
        align-self: center;
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

    .arrow-icon {
        width: 20px;
        fill: black;
    }

    .arrow-icon-extra {
        width: 20px;
        fill: black;
        transform: rotate(180deg);
        margin-top: 1.25rem;
    }

    .flex-column {
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: space-between;
    }

    .flex-column:last-child {
        flex-grow: 1;
    }

    .logo {
        width: 50px;
        stroke-width: 1;
        stroke: black;
    }
</style>
