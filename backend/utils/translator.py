import asyncio
import logging
from googletrans import Translator

logger = logging.getLogger(__name__)

# Initialize Google Translator
translator = Translator()

async def translate_grievance(raw_text: str) -> dict:
    """
    Translates raw grievance text to English (dest='en').
    Returns a dictionary:
      {
        "translated_text": str,
        "detected_language": str
      }
    Gracefully handles timeouts or API errors by falling back to treating raw_text as English ('en').
    """
    if not raw_text or not raw_text.strip():
        return {
            "translated_text": raw_text or "",
            "detected_language": "en"
        }

    try:
        loop = asyncio.get_event_loop()
        # Run sync googletrans call in threadpool executor to avoid blocking event loop
        result = await loop.run_in_executor(
            None,
            lambda: translator.translate(raw_text.strip(), dest='en')
        )
        
        translated_text = result.text if result and result.text else raw_text
        detected_language = result.src if result and result.src else "en"

        return {
            "translated_text": translated_text,
            "detected_language": detected_language
        }
    except Exception as err:
        logger.error(f"Google Translation error or timeout: {err}. Falling back to raw text.")
        return {
            "translated_text": raw_text,
            "detected_language": "en"
        }
