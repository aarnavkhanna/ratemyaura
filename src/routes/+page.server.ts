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
            prompt: "Generate a very detailed description of the person in the image. Make it very detailed, mention every single little detail, including but not limited to the person's facial features, and the person's looks and general style, and every single little facial feature in detail like face shape, eye color, hair style, hair color, build, and clothing item the person has. If there is no person in the image, say error",
            max_tokens: 512,
        };
        const imageDescriptionResponse = await run("@cf/llava-hf/llava-1.5-7b-hf", imageInput);
        const imageDescription = imageDescriptionResponse.result.description;
        console.log("Image description: " + imageDescription);
        const ratingInput = {
            messages: [
                {
                    role: "user",
                    content: "You are an aura rater. Aura is how good a person looks. You will be given an image description and based on that image description, rate how good the person looks using a percentage to the closest two decimal points. Don't estimate, don't round. Don't be afraid to roast aspects of the person that are bad, so give them a low rating if they can improve on something, and give them a high rating if they have good aura. Only return the percentage followed by your reasoning for the aura rating. Also, don't use any formatting in the response. This is an example response: '69.42% This is my reasoning.' This is the image description: " + imageDescription,
                },
            ],
        };
        const ratingResponse = await run("@hf/google/gemma-7b-it", ratingInput);
        const rating = ratingResponse.result.response;
        console.log("Rating: " + rating);

        return withFiles({ rateForm, rating });
    },
};
