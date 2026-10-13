#!/usr/bin/env python3
"""Listener for the Reticulum interface discovery.

It runs one Reticulum node that only listens. It serves the list of the
discovered interfaces as JSON on the route /interfaces.json. It sends only
the fields that the app needs. See docs/fork/reticulum-docker.md.
"""

import json
import os
import shutil
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import RNS

CONFIG_DIR = "/data/rns"
DEFAULT_CONFIG = "/opt/reticulum/config"
PORT = 8081

# The twelve fields that the provider of the app reads. The other fields of a
# record hold interface keys, host addresses and contact addresses. They stay
# in this container.
FIELDS = [
    "discovery_hash",
    "type",
    "name",
    "last_heard",
    "hops",
    "latitude",
    "longitude",
    "height",
    "frequency",
    "bandwidth",
    "sf",
    "cr",
]


def prepare_config():
    os.makedirs(CONFIG_DIR, exist_ok=True)
    if not os.path.exists(os.path.join(CONFIG_DIR, "config")):
        shutil.copyfile(DEFAULT_CONFIG, os.path.join(CONFIG_DIR, "config"))


def public_list():
    """The discovered interfaces, with the allowed fields only."""
    result = []
    for record in RNS.Reticulum.discovered_interfaces():
        item = {}
        for name in FIELDS:
            value = record.get(name)
            if isinstance(value, bytes):
                value = RNS.hexrep(value, delimit=False)
            item[name] = value
        result.append(item)
    return result


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path != "/interfaces.json":
            self.send_error(404)
            return
        body = json.dumps(public_list()).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        pass


def main():
    prepare_config()
    reticulum = RNS.Reticulum(configdir=CONFIG_DIR)
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    try:
        server.serve_forever()
    finally:
        server.server_close()
        del reticulum


if __name__ == "__main__":
    main()
