from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from gtts import gTTS
from fastapi.responses import FileResponse
import uuid
import os

app = FastAPI()

# Load base English generator (GPT-2)

generator = pipeline("text-generation", model="gpt2-medium")

# Load translators
translator_en_hi = pipeline("translation_en_to_hi", model="Helsinki-NLP/opus-mt-en-hi")
translator_en_es = pipeline("translation_en_to_es", model="Helsinki-NLP/opus-mt-en-es")

class ScriptRequest(BaseModel):
    title: str
    tone: str
    length: str
    language: str = "en"

class SEORequest(BaseModel):
    script: str

@app.get("/")
def read_root():
    return {"message": "✅ YouTube Script Generator running with multilingual support!"}

@app.post("/generate")
async def generate_script(request: ScriptRequest):
    prompt = (
        f"Write a full, engaging YouTube video script titled '{request.title}'. "
        f"Use an {request.tone} tone. Make it {request.length} in length. "
        f"Divide into Introduction, Main Content, Conclusion."
    )

    result = generator(
        prompt,
        max_length=500,
        do_sample=True,
        top_k=40,
        top_p=0.85,
        temperature=0.7,
        repetition_penalty=1.7
    )

    script_text = result[0]['generated_text']

    # Translate if needed
    if request.language == "hi":
        script_text = translator_en_hi(script_text)[0]['translation_text']
    elif request.language == "es":
        script_text = translator_en_es(script_text)[0]['translation_text']

    summary = f"This video covers {request.title} in an {request.tone} tone."

    return {
        "script": script_text,
        "summary": summary
    }

@app.post("/voiceover")
async def generate_voiceover(request: ScriptRequest):
    # For voiceover, use the same text prompt
    text = f"This is a voiceover for {request.title}."
    if request.language == "hi":
        text = translator_en_hi(text)[0]['translation_text']
    elif request.language == "es":
        text = translator_en_es(text)[0]['translation_text']

    tts = gTTS(text=text, lang=request.language)
    filename = f"{uuid.uuid4()}.mp3"
    tts.save(filename)
    return FileResponse(filename, media_type='audio/mpeg', filename="voiceover.mp3")

@app.post("/seo")
async def seo_suggestions(request: SEORequest):
    keywords = request.script.split()[:5]
    tags = [kw.lower() for kw in keywords]
    return {"keywords": keywords, "tags": tags}
