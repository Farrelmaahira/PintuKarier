import asyncio
import sys
import edge_tts

async def main():
    if len(sys.argv) < 3:
        sys.exit(1)
    text = sys.argv[1]
    voice = sys.argv[2]
    communicate = edge_tts.Communicate(text, voice)
    async for chunk in communicate.stream():
        if chunk.get("type") == "audio":
            sys.stdout.buffer.write(chunk["data"])

if __name__ == "__main__":
    asyncio.run(main())
