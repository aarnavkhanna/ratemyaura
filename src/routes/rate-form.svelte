<script lang="ts">
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
    import LoaderCircle from "lucide-svelte/icons/loader-circle";

    export let data: SuperValidated<Infer<RateFormSchema>>;

    const form = superForm(data, {
        validators: zodClient(rateFormSchema),
        delayMs: 100,
    });

    const { form: formData, enhance, delayed } = form;

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
        <img src={imageURL} alt="Uploaded" class="w-64 h-64 object-contain" />
    {:else}
        <div class="w-64 h-64 border rounded-lg"></div>
    {/if}
    <form method="POST" enctype="multipart/form-data" use:enhance class="flex flex-col justify-center items-center gap-4">
        <Form.Field {form} name="image">
            <Form.Control let:attrs>
                <Form.Label>Image</Form.Label>
                <input {...attrs} type="file" bind:files={$imageFiles} />
            </Form.Control>
            <Form.Description>Upload an image to rate.</Form.Description>
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
</div>
