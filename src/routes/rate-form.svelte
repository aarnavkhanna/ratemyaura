<script lang="ts">
    import type { ActionData } from "./$types";
    import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { rateFormSchema, type RateFormSchema } from "./schema";
    import {
        type SuperValidated,
        type Infer,
        superForm,
        fileProxy,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import * as Alert from "$lib/components/ui/alert";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { toast } from "svelte-sonner";
    import Gauge from "$lib/components/Gauge.svelte";
    import LoaderCircle from "lucide-svelte/icons/loader-circle";
    import Sparkles from "lucide-svelte/icons/sparkles";

    export let data: SuperValidated<Infer<RateFormSchema>>;
    export let form: ActionData;

    const rateForm = superForm(data, {
        validators: zodClient(rateFormSchema),
        delayMs: 100,
        onError() {
            toast.error("Something went wrong, please try again later");
        },
    });

    const { form: formData, enhance, delayed } = rateForm;

    const imageFiles = fileProxy(formData, "image");
    let imageURL: string = "";
    imageFiles.subscribe((files) => {
        if (files[0]) {
            imageURL = URL.createObjectURL(files[0]);
        };
    });
</script>

<div class="flex flex-col justify-center items-center gap-4">
    {#if imageURL}
        <img src={imageURL} alt="Uploaded" class="w-96 h-auto object-contain border border-dashed rounded-lg p-4" transition:slide={{ delay: 250, duration: 300, easing: quintOut, axis: 'x' }} />
    {/if}
    <form method="POST" enctype="multipart/form-data" use:enhance class="flex flex-col justify-center items-center gap-4">
        <Form.Field form={rateForm} name="image">
            <Form.Control let:attrs>
                <Form.Label>Image</Form.Label>
                <input {...attrs} type="file" accept=".png, .jpg, .jpeg" bind:files={$imageFiles} class="flex w-full text-sm border rounded-md px-3 py-2 file:bg-transparent file:text-foreground file:font-medium file:border-0" />
            </Form.Control>
            <Form.Description>Note: only png, jpg, and jpeg are accepted.</Form.Description>
            <Form.FieldErrors />
        </Form.Field>
        <Form.Button disabled={$delayed}>
            {#if $delayed}
                <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
                Rating...
            {:else}
                Rate my aura
            {/if}
        </Form.Button>
    </form>
    {#if $delayed}
        <Alert.Root class="flex flex-col gap-2 max-w-96">
            <Sparkles class="h-4 w-4" />
            <Alert.Title>
                <Skeleton class="h-4 w-32" />
            </Alert.Title>
            <Alert.Description class="flex flex-col gap-2">
                <Skeleton class="h-4 w-full" />
                <Skeleton class="h-4 w-full" />
            </Alert.Description>
        </Alert.Root>
    {:else if form && form.rating}
        <Alert.Root class="flex flex-col gap-2 max-w-96">
            <Sparkles class="h-4 w-4" />
            <Alert.Title>
                Rating: {form.rating}%
            </Alert.Title>
            <Gauge value={form.rating} max={100} />
            <Alert.Description>
                AI's Reasoning: {form.ratingReasoning}
            </Alert.Description>
        </Alert.Root>
    {/if}
</div>
