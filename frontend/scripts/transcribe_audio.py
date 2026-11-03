"""Script transkripsi audio vokal interview kandidat memakai ffmpeg dan speech_recognition.

Menerima path file audio (webm, mp4, ogg, wav) lalu mengonversi ke 16kHz mono WAV
dan mengekstrak teks ucapan bahasa Indonesia (id-ID) via Google Speech Recognition.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile

import speech_recognition as sr


def transcribe_file(audio_path: str, lang: str = "id-ID") -> str:
    if not os.path.exists(audio_path):
        return ""

    # Konversi audio input (webm / mp4 / ogg) ke format wav 16kHz mono memakai ffmpeg
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_wav:
        wav_path = tmp_wav.name

    try:
        cmd = [
            "ffmpeg",
            "-y",
            "-loglevel", "error",
            "-i", audio_path,
            "-ar", "16000",
            "-ac", "1",
            "-c:a", "pcm_s16le",
            wav_path,
        ]
        res = subprocess.run(cmd, capture_output=True, timeout=15)
        if res.returncode != 0:
            return ""

        recognizer = sr.Recognizer()
        with sr.AudioFile(wav_path) as source:
            audio_data = recognizer.record(source)

        text = recognizer.recognize_google(audio_data, language=lang)
        return text.strip()
    except sr.UnknownValueError:
        # Vokal tidak terdengar atau hening
        return ""
    except Exception as exc:
        sys.stderr.write(f"Transcription notice: {exc}\n")
        return ""
    finally:
        if os.path.exists(wav_path):
            try:
                os.remove(wav_path)
            except OSError:
                pass


def main() -> None:
    if len(sys.argv) < 2:
        print(json.dumps({"text": "", "error": "Argumen path file audio diperlukan"}))
        return

    input_file = sys.argv[1]
    lang = sys.argv[2] if len(sys.argv) > 2 else "id-ID"
    transcribed = transcribe_file(input_file, lang)
    print(json.dumps({"text": transcribed}, ensure_ascii=False))


if __name__ == "__main__":
    main()
