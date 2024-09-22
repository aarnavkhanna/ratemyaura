<script lang="ts">
    import "../app.css";
    import Header from "./Header.svelte";
</script>

<Header />

<main class="py-4 px-4 md:px-16 lg:px-32 mx-auto max-w-[96rem]">
    <slot />
</main>
