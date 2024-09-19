import type { PageServerLoad, Actions } from "./$types";
import { superValidate, message, fail } from "sveltekit-superforms";
import { rateFormSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";

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

        return message(rateForm, "Posted OK!");
    },
};
