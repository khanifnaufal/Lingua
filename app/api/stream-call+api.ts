import { StreamClient } from "@stream-io/node-sdk";
import { lessons } from "../../data/lessons";
import { languages } from "../../data/languages";

const apiKey = process.env.STREAM_API_KEY!;
const secret = process.env.STREAM_SECRET_API_KEY!;

export async function POST(request: Request) {
  try {
    const { userId, lessonId, languageId } = await request.json();

    if (!userId || !lessonId || !languageId) {
      return Response.json(
        { error: "userId, lessonId, and languageId are required" },
        { status: 400 }
      );
    }

    const client = new StreamClient(apiKey, secret, { timeout: 15000 });

    // Create a unique call ID based on the lesson and language
    // We append the userId to ensure each user gets their own private call with the AI
    const callId = `lesson-${lessonId}-${languageId}-${userId}`.replace(/[^a-zA-Z0-9_-]/g, '_');
    
    const call = client.video.call("default", callId);

    // Find the lesson and language to pack dynamic context for the agent
    const lesson = lessons.find((l) => l.id === lessonId);
    const language = languages.find((l) => l.id === languageId);

    const customData: Record<string, any> = {
      lessonId,
      languageId,
    };

    if (lesson && language) {
      customData.lessonTitle = lesson.title;
      customData.languageName = language.name;
      customData.goals = lesson.goal || "";
      customData.aiTeacherPrompt = lesson.aiTeacherPrompt || "";
      
      // Extract target vocabulary
      const vocabulary = lesson.activities
        .filter((a) => a.type === "vocabulary" && a.vocabulary)
        .map((a) => a.vocabulary);
      customData.vocabulary = JSON.stringify(vocabulary);

      // Extract target phrases
      const phrases = lesson.activities
        .filter((a) => a.type === "phrase" && a.phrase)
        .map((a) => a.phrase);
      customData.phrases = JSON.stringify(phrases);
    }

    // Ensure the call is created and both user & agent are members (with admin roles)
    await call.getOrCreate({
      data: {
        created_by_id: userId,
        members: [
          { user_id: userId, role: "admin" },
          { user_id: "ai-teacher-agent", role: "admin" },
        ],
        custom: customData,
      },
    });

    return Response.json({ callId });
  } catch (error) {
    console.error("Error creating Stream call:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
