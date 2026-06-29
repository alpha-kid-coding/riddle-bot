#!/usr/bin/env python3
from __future__ import annotations

import json
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
REVIEWS_FILE = BASE_DIR / "riddlebotrivews"
TIMES_FILE = BASE_DIR / "riddlebottimes"
HOST = "127.0.0.1"
PORT = 8767


def send_json(handler: SimpleHTTPRequestHandler, status: int, payload: dict | list) -> None:
    encoded = json.dumps(payload).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type")
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(encoded)))
    handler.end_headers()
    handler.wfile.write(encoded)


def load_reviews() -> list[dict]:
    if not REVIEWS_FILE.exists():
        return []

    entries: list[dict] = []
    for line in REVIEWS_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            item = json.loads(line)
        except json.JSONDecodeError:
            continue
        if isinstance(item, dict):
            entries.append(item)
    return entries


def load_times() -> list[dict]:
    if not TIMES_FILE.exists():
        return []

    entries: list[dict] = []
    for line in TIMES_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            item = json.loads(line)
        except json.JSONDecodeError:
            continue
        if isinstance(item, dict):
            entries.append(item)
    return entries


class RiddleRequestHandler(SimpleHTTPRequestHandler):
    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        if self.path == "/api/reviews":
            send_json(self, HTTPStatus.OK, load_reviews())
            return
        if self.path == "/api/times":
            send_json(self, HTTPStatus.OK, load_times())
            return
        super().do_GET()

    def do_POST(self) -> None:  # noqa: N802
        if self.path not in {"/api/reviews", "/api/times"}:
            self.send_error(HTTPStatus.NOT_FOUND, "Unknown endpoint")
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        if content_length <= 0:
            self.send_error(HTTPStatus.BAD_REQUEST, "Missing request body")
            return

        raw_body = self.rfile.read(content_length)
        try:
            payload = json.loads(raw_body.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self.send_error(HTTPStatus.BAD_REQUEST, "Invalid JSON")
            return

        if not isinstance(payload, dict):
            self.send_error(HTTPStatus.BAD_REQUEST, "Expected a JSON object")
            return

        payload["savedAt"] = datetime.now(timezone.utc).isoformat()

        destination = REVIEWS_FILE if self.path == "/api/reviews" else TIMES_FILE
        destination.parent.mkdir(parents=True, exist_ok=True)
        with destination.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(payload, ensure_ascii=True) + "\n")

        send_json(self, HTTPStatus.CREATED, {"ok": True})


def main() -> None:
    REVIEWS_FILE.touch(exist_ok=True)
    TIMES_FILE.touch(exist_ok=True)
    server = ThreadingHTTPServer((HOST, PORT), RiddleRequestHandler)
    print(f"Serving on http://{HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()
