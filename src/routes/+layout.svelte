<script lang="ts">
    import "../app.css";
    import Header from "./Header.svelte";
    import { Toaster } from "$lib/components/ui/sonner";
</script>

<Toaster richColors theme="dark" />

<Header />

<main class="py-4 px-4 md:px-16 lg:px-32 mx-auto mb-6 max-w-[96rem]">
    <slot />
</main>
