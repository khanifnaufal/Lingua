const visionAgentServerUrl = process.env.VISION_AGENT_SERVER_URL || "http://127.0.0.1:8000";

export async function POST(request: Request) {
  try {
    const { callId, callType = "default" } = await request.json();

    if (!callId) {
      return Response.json({ error: "callId is required" }, { status: 400 });
    }

    console.log(`[Proxy] Requesting Vision Agent server to start session for call ${callId} of type ${callType}...`);

    // Proxy the start session request to the Vision Agent server
    const response = await fetch(`${visionAgentServerUrl}/calls/${callId}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ call_type: callType }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Vision Agent server error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`[Proxy] Start session response from Vision Agent server:`, data);
    return Response.json(data);
  } catch (error: any) {
    console.error("Error starting agent session:", error);
    return Response.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
