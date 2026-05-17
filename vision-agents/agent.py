import os
import logging
from dotenv import load_dotenv
from vision_agents.core import Agent, AgentLauncher, User, Runner
from vision_agents.plugins import getstream, openai

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AI-Teacher-Agent")

# Load environment variables from the .env file in the same directory
load_dotenv()

# Centralized prompt instructions for the AI language teacher
INSTRUCTIONS = (
    "You are a warm, highly encouraging, and energetic AI language teacher named 'Prof. Lingua'. "
    "Your default language of communication is English. "
    "You always speak in English and teach the selected foreign language through English. "
    "Help the user practice speaking and pronunciation. Be supportive, friendly, and brief in your "
    "explanations to allow the user plenty of speaking time. Praise correct usage and gently correct mistakes."
)

async def create_agent(**kwargs) -> Agent:
    """
    Factory function to instantiate the Vision Agent.
    Configures OpenAI Realtime for the voice-only dialogue model,
    Stream Edge for real-time WebRTC media streams, and sets the teacher instructions.
    """
    logger.info("Initializing AI Teacher Agent...")
    
    # Initialize OpenAI Realtime voice model (audio-only, so send_video=False)
    llm = openai.Realtime(
        voice="alloy",
        send_video=False
    )
    
    # Initialize Stream edge transport
    edge = getstream.Edge()
    
    # Define agent user metadata
    agent_user = User(
        name="AI Teacher",
        id="ai-teacher-agent"
    )
    
    # Create and return the configured Agent
    return Agent(
        edge=edge,
        llm=llm,
        agent_user=agent_user,
        instructions=INSTRUCTIONS
    )

async def join_call(agent: Agent, call_type: str, call_id: str, **kwargs) -> None:
    """
    Lifecycle handler that executes when the agent joins a Stream call session.
    """
    logger.info(f"Agent joining call of type '{call_type}' with ID '{call_id}'...")
    
    call = await agent.create_call(call_type, call_id)
    
    # 1. Fetch updated call metadata to get custom fields
    logger.info("Fetching call metadata from Stream Edge...")
    await call.get()
    
    custom_data = call.custom_data or {}
    logger.info(f"Retrieved call custom data: {custom_data}")
    
    lesson_title = custom_data.get("lessonTitle", "Audio Lesson")
    language_name = custom_data.get("languageName", "the selected language")
    goals = custom_data.get("goals", "")
    vocab_str = custom_data.get("vocabulary", "[]")
    phrases_str = custom_data.get("phrases", "[]")
    specific_prompt = custom_data.get("aiTeacherPrompt", "")
    
    # Parse target vocabulary and phrases
    import json
    try:
        vocabulary = json.loads(vocab_str) if isinstance(vocab_str, str) else (vocab_str or [])
    except Exception:
        vocabulary = []
        
    try:
        phrases = json.loads(phrases_str) if isinstance(phrases_str, str) else (phrases_str or [])
    except Exception:
        phrases = []

    # 2. Build dynamic structured instructions for Prof. Lingua
    instructions = (
        "You are a warm, highly encouraging, and energetic AI language teacher named 'Prof. Lingua'. "
        "Your default language of communication is English. "
        "You always speak in English and teach the selected foreign language through English. "
        "Help the user practice speaking and pronunciation. Be supportive, friendly, and brief in your "
        "explanations to allow the user plenty of speaking time. Praise correct usage and gently correct mistakes.\n\n"
        f"Today's Lesson: {lesson_title}\n"
        f"Language Being Taught: {language_name}\n"
    )
    
    if goals:
        instructions += f"Lesson Goal: {goals}\n"
        
    if specific_prompt:
        instructions += f"Specific Teacher Focus: {specific_prompt}\n"
        
    if vocabulary:
        instructions += "\nTarget Vocabulary Words to practice (introduce these and have the user repeat/practice them):\n"
        for v in vocabulary:
            word = v.get('word', '')
            trans = v.get('translation', '')
            instructions += f"- {word} (translation: {trans})\n"
            
    if phrases:
        instructions += "\nTarget Phrases to practice (introduce these and have the user repeat/practice them):\n"
        for p in phrases:
            phrase = p.get('phrase', '')
            trans = p.get('translation', '')
            instructions += f"- {phrase} (translation: {trans})\n"

    # 3. Update agent instructions dynamically!
    agent.instructions = instructions
    if hasattr(agent.llm, "set_instructions"):
        agent.llm.set_instructions(instructions)
    logger.info("Dynamically updated agent instructions successfully.")

    async with agent.join(call):
        logger.info("Agent joined call session successfully!")
        
        # Initial greeting to start the lesson flow naturally
        await agent.simple_response(
            f"Introduce yourself as Prof. Lingua, welcome the student to today's {language_name} lesson about {lesson_title}, "
            "and invite them to begin. Speak warmly, encouragingly, and briefly!"
        )
        
        # Block until the call is terminated or left
        await agent.finish()
        logger.info("Agent call session finished.")

if __name__ == "__main__":
    # Wrap the launcher with Runner to support CLI execution (console mode or server mode)
    launcher = AgentLauncher(
        create_agent=create_agent,
        join_call=join_call
    )
    Runner(launcher).cli()
