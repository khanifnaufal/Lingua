const visionAgentServerUrl = process.env.VISION_AGENT_SERVER_URL || "http://127.0.0.1:8000";

export async function POST(request: Request) {
  try {
    const { callId, sessionId } = await request.json();

    if (!callId || !sessionId) {
      return Response.json({ error: "callId and sessionId are required" }, { status: 400 });
    }

    console.log(`[Proxy] Requesting Vision Agent server to stop session ${sessionId} for call ${callId}...`);

    // Proxy the stop session request to the Vision Agent server
    const response = await fetch(`${visionAgentServerUrl}/calls/${callId}/sessions/${sessionId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Vision Agent server error: ${response.status} - ${errorText}`);
    }

    console.log(`[Proxy] Stop session succeeded for session ${sessionId}.`);
    return Response.json({ success: true });
  } catch (error: any) {
    console.error("Error stopping agent session:", error);
    return Response.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
