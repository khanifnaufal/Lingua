---
name: Agent
description: Use when building voice agents, video agents, or real-time AI applications. Reach for this skill when you need to create conversational agents with speech-to-text, language models, and text-to-speech; integrate with 30+ AI providers; deploy to production with Docker/Kubernetes; or add function calling and tool integration via MCP.
metadata:
    mintlify-proj: agent
    version: "1.0"
---

# Vision Agents Skill

## Product summary

Vision Agents is a Python SDK for building real-time voice and video agents with swappable AI providers. It orchestrates speech-to-text, language models, text-to-speech, and video processing into a single `Agent` class that handles conversation flow, tool calling, and event-driven interactions. The framework is transport-agnostic (uses Stream's edge network by default) and ships with 30+ plugins for LLMs (Gemini, OpenAI, Grok), STT (Deepgram, ElevenLabs), TTS (Cartesia, Kokoro), and vision models. Key files: `main.py` (agent definition), `.env` (API keys), `pyproject.toml` (dependencies). CLI commands: `uv run agent.py run` (console mode), `uv run agent.py serve` (HTTP server). Primary docs: https://visionagents.ai

## When to use

Reach for this skill when:
- **Building voice agents**: Creating conversational agents that listen, understand, and respond naturally via speech
- **Building video agents**: Adding real-time video understanding, object detection, or visual analysis to agents
- **Choosing between realtime vs custom pipelines**: Deciding whether to use a single realtime model (Gemini, OpenAI) or mix STT/LLM/TTS providers
- **Integrating tools and functions**: Registering Python functions or MCP servers for the agent to call during conversations
- **Deploying to production**: Setting up Docker containers, Kubernetes clusters, horizontal scaling with Redis, or monitoring with Prometheus
- **Testing agent behavior**: Verifying tool calls, responses, and intent without spinning up audio/video infrastructure
- **Handling multi-speaker calls**: Configuring audio filters for multiple participants
- **Integrating with phone networks**: Connecting agents to Twilio for inbound/outbound calls

## Quick reference

### Core Agent Setup

```python
from vision_agents.core import Agent, AgentLauncher, User, Runner
from vision_agents.plugins import getstream, gemini, deepgram, elevenlabs

async def create_agent(**kwargs) -> Agent:
    return Agent(
        edge=getstream.Edge(),
        agent_user=User(name="Assistant", id="agent"),
        instructions="You're a helpful voice assistant.",
        llm=gemini.Realtime(),  # or gemini.LLM() for custom pipeline
        stt=deepgram.STT(),      # only for custom pipeline
        tts=elevenlabs.TTS(),    # only for custom pipeline
    )

async def join_call(agent: Agent, call_type: str, call_id: str, **kwargs) -> None:
    call = await agent.create_call(call_type, call_id)
    async with agent.join(call):
        await agent.simple_response("Greet the user")
        await agent.finish()

if __name__ == "__main__":
    Runner(AgentLauncher(create_agent=create_agent, join_call=join_call)).cli()
```

### CLI Commands

| Command | Purpose |
|---------|---------|
| `uv run agent.py run` | Console mode (single agent, development) |
| `uv run agent.py serve --host 0.0.0.0 --port 8000` | HTTP server mode (production, multi-session) |
| `uv run pytest tests/ -m integration` | Run tests with TestSession |

### Agent Response Methods

| Method | Use case |
|--------|----------|
| `await agent.simple_response(text)` | Send text to LLM, get response via TTS |
| `await agent.simple_audio_response(pcm)` | Send raw audio to realtime LLM |
| `await agent.say(text)` | Speak text directly, bypass LLM |
| `await agent.finish()` | Wait for call to end gracefully |

### Plugin Installation

```bash
# Install only what you need
uv add "vision-agents[getstream,gemini,deepgram,elevenlabs]"
```

### Environment Variables

```bash
STREAM_API_KEY=your_key
STREAM_API_SECRET=your_secret
GOOGLE_API_KEY=your_key
DEEPGRAM_API_KEY=your_key
ELEVENLABS_API_KEY=your_key
```

### Event Subscription

```python
from vision_agents.core.events import CallSessionParticipantJoinedEvent
from vision_agents.core.stt.events import STTTranscriptEvent

@agent.events.subscribe
async def on_participant_joined(event: CallSessionParticipantJoinedEvent):
    print(f"User joined: {event.participant.name}")

@agent.events.subscribe
async def on_transcript(event: STTTranscriptEvent):
    print(f"Transcribed: {event.text}")
```

### Function Calling

```python
@llm.register_function(description="Get weather for a location")
async def get_weather(location: str) -> dict:
    return {"temp": "22C", "condition": "Sunny"}

# LLM calls this automatically when relevant
response = await llm.simple_response("What's the weather in London?")
```

## Decision guidance

### When to use Realtime vs Custom Pipeline

| Aspect | Realtime Model | Custom Pipeline |
|--------|---|---|
| **Latency** | Lowest (~100ms) | Higher (~300-500ms) |
| **Setup** | Single LLM plugin | STT + LLM + TTS |
| **Voice control** | Limited (provider voices) | Full (any TTS provider) |
| **Transcription** | Built-in | Choose your STT |
| **Best for** | Speed, simplicity | Custom voices, specific providers |
| **Example** | `gemini.Realtime()` | `gemini.LLM()` + `deepgram.STT()` + `elevenlabs.TTS()` |

**Choose Realtime if**: You want the fastest path and don't need custom voices.  
**Choose Custom Pipeline if**: You need specific STT/TTS providers, custom voices, or full control over each component.

### When to use Console vs HTTP Server Mode

| Mode | Use case |
|------|----------|
| **Console (`run`)** | Development, testing, single agent |
| **HTTP Server (`serve`)** | Production, multiple concurrent sessions, API access |

### When to use Local vs Remote MCP Servers

| Type | Use case |
|------|----------|
| **Local (`MCPServerLocal`)** | Custom tools, internal services, stdio transport |
| **Remote (`MCPServerRemote`)** | Third-party services (GitHub, etc.), HTTP/HTTPS |

## Workflow

### Building a voice agent

1. **Initialize project**: `uv init --python 3.12 my-agent && cd my-agent && uv add "vision-agents[getstream,gemini,deepgram,elevenlabs]" python-dotenv`

2. **Set up environment**: Create `.env` with `STREAM_API_KEY`, `STREAM_API_SECRET`, `GOOGLE_API_KEY`, `DEEPGRAM_API_KEY`, `ELEVENLABS_API_KEY`

3. **Define agent factory**: Write `create_agent()` that returns an `Agent` instance with your chosen LLM, STT, TTS

4. **Define join handler**: Write `join_call()` that specifies what happens when the agent joins a call (greeting, tool setup, etc.)

5. **Wrap with Runner**: Create `Runner(AgentLauncher(create_agent=..., join_call=...))` and call `.cli()`

6. **Test locally**: `uv run agent.py run` to start console mode, open the browser link to test

7. **Deploy**: Build Docker image, push to registry, deploy with Kubernetes or Docker Compose

### Adding function calling

1. **Register functions**: Use `@llm.register_function(description="...")` decorator on async functions

2. **Test with TestSession**: Use `vision_agents.testing.TestSession` to verify tool calls without audio/video

3. **Monitor execution**: Subscribe to `ToolStartEvent` and `ToolEndEvent` to track tool execution

### Deploying to production

1. **Choose deployment mode**: Use HTTP server (`serve`) for multi-session deployments

2. **Configure session limits**: Set `max_concurrent_sessions`, `max_sessions_per_call`, `agent_idle_timeout` in `AgentLauncher`

3. **Build Docker image**: Use provided `Dockerfile` (CPU) or `Dockerfile.gpu` (local models)

4. **Set up scaling**: For multiple nodes, configure `SessionRegistry` with Redis backend

5. **Add monitoring**: Enable Prometheus metrics with `MetricsCollector` and OpenTelemetry

6. **Deploy to Kubernetes**: Use Helm charts from the Deploy example, configure health checks (`/health`, `/ready`)

## Common gotchas

- **Forgetting to load `.env`**: Always call `load_dotenv()` before creating agents, or API keys won't be found
- **Mixing realtime and STT/TTS**: Don't pass `stt` or `tts` when using a realtime LLM — they're automatically disabled
- **Synchronous functions in function calling**: Only async functions can be registered with `@llm.register_function()` — sync functions raise `ValueError`
- **Missing turn detection in custom pipelines**: If using a non-realtime LLM with STT/TTS, add a turn detection plugin (Deepgram has built-in, or use Smart Turn)
- **Not handling errors**: Subscribe to error events (`STTErrorEvent`, `LLMErrorEvent`, `TTSErrorEvent`) to catch and recover from transient failures
- **Forgetting `async with agent.join(call)`**: The agent must be joined as an async context manager, or it won't process audio/video
- **Calling `finish()` too early**: `await agent.finish()` blocks until the call ends — don't call it if you want the agent to continue listening
- **Not setting `max_concurrent_sessions` in production**: Without limits, agents can exhaust server resources; set reasonable caps
- **Ignoring latency metrics**: Monitor `llm_latency_ms__avg`, `stt_latency_ms__avg`, `tts_latency_ms__avg` to catch performance regressions
- **Using CPU Dockerfile for local models**: Only use `Dockerfile.gpu` if running local VLMs or inference; most voice agents use cloud APIs and don't need GPU

## Verification checklist

Before submitting agent code:

- [ ] All required API keys are in `.env` and loaded with `load_dotenv()`
- [ ] `create_agent()` returns an `Agent` instance with valid `edge`, `llm`, and `agent_user`
- [ ] `join_call()` is async and calls `await agent.create_call()` and `async with agent.join(call)`
- [ ] For realtime LLM: no `stt` or `tts` parameters passed
- [ ] For custom pipeline: `stt`, `tts`, and `turn_detection` are all configured
- [ ] Function calls are registered with `@llm.register_function()` and are async
- [ ] Error events are subscribed to for graceful failure handling
- [ ] Console mode runs without errors: `uv run agent.py run`
- [ ] HTTP server starts cleanly: `uv run agent.py serve`
- [ ] Health checks respond: `curl http://127.0.0.1:8000/health`
- [ ] For production: Docker image builds and runs with `--platform linux/amd64`
- [ ] For production: Session limits are configured in `AgentLauncher`
- [ ] For production: Prometheus metrics are enabled and scraped
- [ ] Tests pass with `uv run pytest tests/ -m integration`

## Resources

- **Comprehensive navigation**: https://visionagents.ai/llms.txt — Full page-by-page listing for agent reference
- **Quickstart**: https://visionagents.ai/introduction/quickstart — 5-minute setup with Gemini Realtime
- **Voice Agents Guide**: https://visionagents.ai/introduction/voice-agents — Realtime vs custom pipeline, function calling, phone integration
- **HTTP Server & Deployment**: https://visionagents.ai/guides/http-server — API endpoints, session management, authentication, scaling
- **Testing**: https://visionagents.ai/guides/testing — TestSession, LLMJudge, function call assertions
- **Integrations**: https://visionagents.ai/integrations/introduction-to-integrations — 30+ plugins for LLMs, STT, TTS, vision, avatars
- **GitHub**: https://github.com/GetStream/vision-agents — Source code, examples, contribute

---

> For additional documentation and navigation, see: https://visionagents.ai/llms.txt