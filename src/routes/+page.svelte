<script lang="ts">
    import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<div>
    <Sidebar />
    <main></main>
</div>

<style>
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
</style>
