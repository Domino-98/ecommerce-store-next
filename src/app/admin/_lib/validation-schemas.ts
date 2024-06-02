import { z } from 'zod'

const MAX_FILE_SIZE = 4000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const categorySchema = z.object({
    name: z.string().min(1, "Name cannot be blank"),
    description: z.string().optional(),
    slug: z.string().min(1, "Slug cannot be blank"),
    parentId: z.string().optional(),
    image: z
        .any()
        .optional()
        .refine((files) => !files?.length || files[0]?.size <= MAX_FILE_SIZE, `Max image size is 4MB.`)
        .refine(
            (files) => !files?.length || ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
})
