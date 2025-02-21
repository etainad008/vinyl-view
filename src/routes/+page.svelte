<script lang="ts">
    import { getAlbumImage } from "$lib/api";

    let image: string | null = $state("");
    
    const onclick = async () => {
        image = await getAlbumImage("Repentless", "Slayer");
    }
</script>

<button {onclick}>Update</button>
<img src={image} alt="Album Cover" />
