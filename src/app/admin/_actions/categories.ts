"use server";

import { db } from "@/lib/database/db";
import { categorySchema } from "../_lib/validation-schemas";
import { categoryTable } from "@/lib/database/schema";
import { utapi } from "@/lib/uploadthing";
import { DrizzleError } from "@/lib/database/types";
import { UploadThingError } from "uploadthing/server";

export async function createCategory(formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const slug = formData.get("slug") as string;
    const parentId = formData.get("parentId") as string | null;
    const image = formData.get("image") as File | null;

    const validation = categorySchema.safeParse({
        name,
        description,
        slug,
        parentId,
        image
    });

    if (!validation.success) {
        const errorsString = validation.error.issues.map((issue) => issue.message).join(", ");
        return {
            error: errorsString
        }
    }

    let imageUrl = null;

    try {

        if (image) {
            const { data } = await utapi.uploadFiles(image);
            imageUrl = data?.url;
        }

        await db.insert(categoryTable).values({ name, description, slug, parentId: parentId ? parentId : null, image: imageUrl });

        return {
            success: "Category added successfully!"
        }
    } catch (error: unknown) {
        let errorMsg = "An error occurred. Please try again later.";
        const drizzleError = error as DrizzleError;

        if (error instanceof UploadThingError) {
            return {
                error: "An error occurred while uploading image."
            }
        }

        if (imageUrl) {
            const imageKey = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            try {
                await utapi.deleteFiles(imageKey);
            } catch (err: unknown) {
                if (error instanceof UploadThingError) {
                    errorMsg = "An unknown database error occurred. An error occurred while deleting image.";
                }
            }
        }

        (drizzleError.code === "23505")
            ? errorMsg = "Given slug already exists in database."
            : errorMsg = (drizzleError.message || "An unknown database error occurred.");

        return {
            error: errorMsg
        }
    }
}