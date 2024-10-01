<script lang="ts">
    import Logo from "$lib/assets/logo.png?enhanced";
    import { Button } from "$lib/components/ui/button";
    import Github from "lucide-svelte/icons/github";
</script>

<header class="flex flex-row justify-between items-center gap-8 p-6">
    <a class="flex flex-row items-center gap-2" href="/">
        <enhanced:img src={Logo} alt="Rate My Aura Logo" class="w-12 h-auto" />
        <span class="text-2xl font-semibold">Rate My Aura</span>
    </a>
    <Button class="p-2" variant="ghost" size="icon" href="https://github.com/aarnavkhanna/ratemyaura" target="_blank" rel="noopener noreferrer">
        <Github class="h-6 w-6" />
    </Button>
</header>
