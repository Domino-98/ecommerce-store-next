import { auth } from "@/lib/auth";

export async function GET() {
    const session = await auth();

    if (!session) {
        return { status: 401, body: { error: "Unauthorized" } };
    }

    return Response.json({ name: session.user.name })
}