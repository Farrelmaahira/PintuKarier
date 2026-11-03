from __future__ import annotations

import json

from app.routers.parse_cv import Identitas, _ground_identitas, _parse_profil


def test_parse_profil_happy_path() -> None:
    raw = json.dumps({
        "ringkasan": "Fokus frontend.",
        "skill": ["React", "Git"],
        "pengalaman": [{"peran": "Web Developer (Magang)", "tempat": "Kominfo", "waktu": "2025", "poin": "6 halaman", "umur": 21}],
        "proyek": [],
        "organisasi": "bukan list",
        "sertifikasi": ["Dicoding FE"],
        "identitas": {"nim": None, "kampus": " Polines ", "semester": "6", "ipk": "3,75"},
    })
    profil, identitas, teks = _parse_profil(raw)
    assert profil.skill == ["React", "Git"]
    assert profil.pengalaman[0].peran == "Web Developer (Magang)"
    assert profil.organisasi == []
    assert teks == ""
    assert (identitas.nim, identitas.kampus, identitas.semester, identitas.ipk) == ("", "Polines", 6, 3.75)


def test_identitas_drops_unwritten_or_out_of_range_numbers() -> None:
    _, identitas, _ = _parse_profil(json.dumps({"identitas": {"semester": None, "ipk": 87}}))
    assert identitas.semester == 0 and identitas.ipk == 0
    _, identitas, _ = _parse_profil(json.dumps({"identitas": "bukan objek"}))
    assert identitas.kampus == ""


def test_ground_identitas_keeps_only_what_the_cv_says() -> None:
    teks = "Mahasiswa D4 TI, Politeknik Negeri Semarang. NIM 4.33.22.1.05. Semester 6, IPK 3,80/4,00. HP 0812345678"
    tulis = Identitas(nim="4.33.22.1.05", kampus="Politeknik  Negeri Semarang", semester=6, ipk=3.8)
    assert _ground_identitas(tulis, teks) == tulis
    karangan = Identitas(nim="0812345", kampus="Universitas Diponegoro", semester=7, ipk=3.85)
    assert _ground_identitas(karangan, teks) == Identitas()
    assert _ground_identitas(Identitas(ipk=3.8), "IPK 13.80").ipk == 0


def test_parse_profil_falls_back_to_empty_on_malformed_json() -> None:
    profil, _, teks = _parse_profil("ini bukan json")
    assert profil.ringkasan == "" and profil.skill == [] and teks == ""


def test_parse_profil_returns_image_transcription() -> None:
    _, _, teks = _parse_profil(json.dumps({"ringkasan": "", "teks": "Raka Pratama\nReact"}))
    assert teks == "Raka Pratama\nReact"
