import type { PageServerLoad, Actions } from "./$types";
import { superValidate, fail, withFiles } from "sveltekit-superforms";
import { rateFormSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { ACCOUNT_ID, API_KEY } from "$env/static/private";

export const load: PageServerLoad = async () => {
    return {
        rateForm: await superValidate(zod(rateFormSchema)),
    };
};

export const actions: Actions = {
    default: async (event) => {
        const rateForm = await superValidate(event, zod(rateFormSchema));
        if (!rateForm.valid) {
            return fail(400, {
                rateForm,
            });
        };

        const imageBlob = await rateForm.data.image.arrayBuffer();
        async function run(model: string, input: any) {
            const response = await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${model}`,
                {
                    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
                    method: "POST",
                    body: JSON.stringify(input),
                },
            );
            const result = await response.json();
            return result;
        };
        const imageInput = {
            image: [...new Uint8Array(imageBlob)],
            prompt: "Generate a very detailed description for the person in this image, make sure the description is about the person in the image, and the person's facial features, and the person's looks and general style. Make it as detailed as possible, naming every single little facial feature in detail like face shape, eye color, hair style, hair color, build, and clothing item the person has.",
            max_tokens: 512,
        };
        const imageDescriptionResponse = await run("@cf/unum/uform-gen2-qwen-500m", imageInput);
        const imageDescription = imageDescriptionResponse.result.description;
        console.log("Image description: " + imageDescription);
        const ratingInput = {
            messages: [
                {
                    role: "system",
                    content: "You are a aura rater. Aura is how good a person looks. You will be given an image description and based on that image rate how good the person looks using a percentage. Be sure to only return the number of the percentage, and nothing else. Be sure the percentage is to the closest 2 decimal places, make it very precise",
                },
                {
                    role: "user",
                    content: "This is the image description: " + imageDescription,
                },
            ],
        };
        const ratingResponse = await run("@hf/thebloke/mistral-7b-instruct-v0.1-awq", ratingInput);
        const rating = ratingResponse.result.response;
        console.log("Rating: " + rating);

        return withFiles({ rateForm, rating });
    },
};
