<script lang="ts">
    import type { PageData } from "./$types";
    import RateForm from "./rate-form.svelte";
    export let data: PageData;
</script>

<div class="flex flex-col justify-center items-center gap-8">
    <h1 class="text-4xl font-semibold text-center">Rate My Aura</h1>
    <RateForm data={data.rateForm} />
</div>
