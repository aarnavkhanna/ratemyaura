<script lang="ts">
    import type { PageData, ActionData } from "./$types";
    import RateForm from "./rate-form.svelte";
    export let data: PageData;
    export let form: ActionData;
</script>

<div class="flex flex-col justify-center items-center gap-8">
    <h1 class="text-4xl font-semibold text-center">Rate My Aura</h1>
    <RateForm data={data.rateForm} />
    {#if form && form.rating}
        <div class="flex flex-col gap-4">
            <h2 class="text-2xl font-semibold text-center">Rating</h2>
            <p class="text-center">{form.rating}</p>
        </div>
    {/if}
</div>
