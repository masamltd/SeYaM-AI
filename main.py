import os
import uuid
from pathlib import Path

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

load_dotenv()

APP_NAME = os.getenv("APP_NAME", "SeYaM AI")
AI_API_KEY = os.getenv("AI_API_KEY", "")
AI_BASE_URL = os.getenv(
    "AI_BASE_URL",
    "https://api.openai.com/v1"
).rstrip("/")

AI_MODEL = os.getenv("AI_MODEL", "gpt-5.6-mini")

MAX_UPLOAD_MB = int(os.getenv("MAX_UPLOAD_MB", "20"))
MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"
UPLOAD_DIR = BASE_DIR / "uploads"

UPLOAD_DIR.mkdir(exist_ok=True)

app = FastAPI(title=APP_NAME)

# Frontend files
app.mount(
    "/static",
    StaticFiles(directory=FRONTEND_DIR),
    name="static"
)


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]


SYSTEM_PROMPT = """
You are SeYaM AI, a helpful multilingual general-purpose AI assistant.

Understand the user's language automatically.

The user may write:
- Bangla
- Banglish
- English
- Hindi
- Urdu
- Arabic
- Spanish
- French
- German
- Japanese
- Chinese
- or mixed languages.

Reply naturally in the user's language unless they request another language.

Be helpful, accurate and clear.

If a requested action requires a tool that is not currently installed,
do not pretend that you completed it. Clearly explain what is currently
possible.

For safety-sensitive or illegal requests, follow applicable safety rules.
"""


@app.get("/")
async def home():
    return FileResponse(
        FRONTEND_DIR / "index.html"
    )


@app.get("/api/health")
async def health():
    return {
        "ok": True,
        "app": APP_NAME,
        "provider_configured": bool(AI_API_KEY),
        "model": AI_MODEL
    }


@app.post("/api/chat")
async def chat(req: ChatRequest):

    if not AI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail=(
                "AI_API_KEY is not configured. "
                "Copy .env.example to .env and add your API key."
            )
        )

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        }
    ]

    # Keep recent conversation only
    for message in req.messages[-30:]:

        if message.role not in {"user", "assistant"}:
            continue

        if not message.content.strip():
            continue

        messages.append(
            {
                "role": message.role,
                "content": message.content[:12000]
            }
        )

    payload = {
        "model": AI_MODEL,
        "messages": messages,
        "temperature": 0.7
    }

    headers = {
        "Authorization": f"Bearer {AI_API_KEY}",
        "Content-Type": "application/json"
    }

    try:

        async with httpx.AsyncClient(
            timeout=90
        ) as client:

            response = await client.post(
                f"{AI_BASE_URL}/chat/completions",
                headers=headers,
                json=payload
            )

    except httpx.RequestError as exc:

        raise HTTPException(
            status_code=502,
            detail=f"AI provider connection failed: {exc}"
        )

    if response.status_code >= 400:

        try:
            detail = response.json()
        except Exception:
            detail = response.text[:1000]

        raise HTTPException(
            status_code=response.status_code,
            detail=detail
        )

    data = response.json()

    try:

        answer = data["choices"][0]["message"]["content"]

    except (
        KeyError,
        IndexError,
        TypeError
    ):

        raise HTTPException(
            status_code=502,
            detail="Unexpected response from AI provider."
        )

    return {
        "answer": answer,
        "model": AI_MODEL
    }


@app.post("/api/upload")
async def upload(
    file: UploadFile = File(...)
):

    content_type = (
        file.content_type
        or "application/octet-stream"
    )

    allowed_prefixes = (
        "image/",
        "video/",
        "audio/",
        "text/"
    )

    allowed_exact = {
        "application/pdf",
        "application/json",
        "application/zip",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }

    if not (
        content_type.startswith(allowed_prefixes)
        or content_type in allowed_exact
    ):

        raise HTTPException(
            status_code=415,
            detail="This file type is not allowed."
        )

    data = await file.read(
        MAX_UPLOAD_BYTES + 1
    )

    if len(data) > MAX_UPLOAD_BYTES:

        raise HTTPException(
            status_code=413,
            detail=(
                f"Maximum file size is "
                f"{MAX_UPLOAD_MB} MB."
            )
        )

    suffix = Path(
        file.filename or ""
    ).suffix[:10]

    safe_name = (
        f"{uuid.uuid4().hex}{suffix}"
    )

    target = UPLOAD_DIR / safe_name

    target.write_bytes(data)

    return {
        "ok": True,
        "filename": file.filename,
        "stored_name": safe_name,
        "content_type": content_type,
        "size": len(data)
    }