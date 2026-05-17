import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.STREAM_API_KEY!;
const secret = process.env.STREAM_SECRET_API_KEY!;

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    // Initialize the Stream client
    const client = new StreamClient(apiKey, secret, { timeout: 15000 });

    // Create a token for the user
    // In production, you should verify the Clerk session here
    const token = client.generateUserToken({ user_id: userId });

    return Response.json({ token });
  } catch (error) {
    console.error("Error generating Stream token:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
