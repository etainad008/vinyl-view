<script lang="ts">
    import { fade } from 'svelte/transition';
    import { pushState } from '$app/navigation';
    import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<div>
    <Sidebar />
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

    .sidebar > header > button.back {
        border: none;
        background-color: springgreen;
        padding: 0.5rem 1rem;
        cursor: pointer;
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

    .release-controls {
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-block: 0.5rem;
    }

    .release-controls > button {
        display: flex;
        width: 1.25rem;
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
        width: 1.75rem;
        margin-right: auto;
    }

    .release-controls > button:first-child > svg {
        fill: black;
    }

    .release-image {
        display: grid;
        grid-template-areas: 'stack';
    }

    .release-image > img {
        width: 100%;
        aspect-ratio: 1 / 1;
        grid-area: stack;
    }

    .release-image > button {
        width: 100%;
        aspect-ratio: 1 / 1;
        opacity: 0;
        background-color: transparent;
        grid-area: stack;
        border: none;
        outline: none;
        cursor: pointer;
    }

    .release-image > button:is(:focus-visible) {
        opacity: 1;
        outline: auto;
    }

    .release-info {
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
    }

    .release-info .release-artist {
        font-weight: 400;
        color: rgb(90, 90, 90);
    }

    .release-info > .data-cards {
        display: flex;
        justify-content: space-around;
    }

    .release-info > .data-cards > * {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .data-title {
        font-size: .85rem;
        font-weight: 400;
        color: rgb(90, 90, 90);
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

    main {
        padding: 2rem;
    }
</style>
