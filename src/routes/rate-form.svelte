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

    export let data: SuperValidated<Infer<RateFormSchema>>;

    const form = superForm(data, {
        validators: zodClient(rateFormSchema),
    });

    const { form: formData, enhance } = form;

    const imageFile = fileProxy(formData, "image");
</script>

<form method="POST" enctype="multipart/form-data" use:enhance>
    <Form.Field {form} name="image">
        <Form.Control let:attrs>
            <Form.Label>Image</Form.Label>
            <input {...attrs} type="file" bind:files={$imageFile} />
        </Form.Control>
        <Form.Description>Upload an image to rate.</Form.Description>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Button>Submit</Form.Button>
</form>
