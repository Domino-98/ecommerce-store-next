import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

export async function deleteImage(url: string) {
    const imageKey = url.substring(url.lastIndexOf("/") + 1);
    await utapi.deleteFiles(imageKey);
}