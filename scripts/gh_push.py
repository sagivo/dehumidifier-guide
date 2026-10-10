#!/usr/bin/env python3
"""Push a local directory to GitHub via the REST git-database API.

Native `git push` is blocked in this sandbox (Sentinel denies SSH, gh CLI
can't use the surrogate credential), so this builds blobs -> tree -> commit
-> ref entirely through api.github.com.

Usage: gh_push.py <owner/repo> <local-dir> [commit-message]
"""
import base64
import http.client
import json
import os
import socket
import sys
import time
import urllib.request
import urllib.error

sys.path.insert(0, "/opt/hatch/skills/skill-creator/bin")
from dynamic_credentials import add_surrogate_to_request

REPO = sys.argv[1] if len(sys.argv) > 1 else "sagivo/robot-mower-guide"
ROOT = os.path.abspath(sys.argv[2] if len(sys.argv) > 2 else ".")
MESSAGE = sys.argv[3] if len(sys.argv) > 3 else "Initial site: Astro + calculators + 5 guides"
BLOB_CACHE = os.path.join(ROOT, "scripts", ".gh_blob_cache.json")
BLOB_SLEEP = 0.15
EXCLUDE = {"node_modules", "dist", ".git", ".astro", "__pycache__", ".gh_blob_cache.json"}

TRANSIENT = (urllib.error.URLError, http.client.RemoteDisconnected,
             http.client.BadStatusLine, TimeoutError, socket.timeout)


def api(method, path, data=None, retries=8):
    body = json.dumps(data).encode() if data is not None else None
    for attempt in range(retries):
        req = urllib.request.Request(
            f"https://api.github.com{path}", method=method, data=body,
            headers={"Content-Type": "application/json",
                     "Accept": "application/vnd.github+json",
                     "X-GitHub-Api-Version": "2022-11-28"})
        add_surrogate_to_request(req, "custom.github", allowed_hosts=("api.github.com",))
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            detail = e.read().decode()[:200]
            print(f"HTTP {e.code} {method} {path} (try {attempt+1}/{retries}): {detail}", flush=True)
            if e.code in (401, 403, 404, 422):
                raise
        except TRANSIENT as e:
            print(f"TRANSIENT {type(e).__name__} {method} {path} (try {attempt+1}/{retries})", flush=True)
        if attempt < retries - 1:
            time.sleep(min(3 * 2 ** attempt, 60))
    raise RuntimeError(f"API failed: {method} {path}")


def load_cache():
    try:
        return json.load(open(BLOB_CACHE))
    except (OSError, ValueError):
        return {}


def save_cache(cache):
    os.makedirs(os.path.dirname(BLOB_CACHE), exist_ok=True)
    json.dump(cache, open(BLOB_CACHE, "w"))


def collect_files():
    out = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE]
        for fn in filenames:
            if fn in EXCLUDE:
                continue
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, ROOT)
            out.append((rel, full))
    return sorted(out)


def main():
    files = collect_files()
    print(f"files to push: {len(files)}", flush=True)
    cache = load_cache()

    def blob_for(rel, full):
        st = os.stat(full)
        key = f"{rel}|{st.st_size}|{int(st.st_mtime)}"
        if key in cache:
            return cache[key]
        with open(full, "rb") as fh:
            content = fh.read()
        try:
            sha = api("POST", f"/repos/{REPO}/git/blobs",
                      {"content": content.decode("utf-8"), "encoding": "utf-8"})["sha"]
        except UnicodeDecodeError:
            sha = api("POST", f"/repos/{REPO}/git/blobs",
                      {"content": base64.b64encode(content).decode(), "encoding": "base64"})["sha"]
        cache[key] = sha
        time.sleep(BLOB_SLEEP)
        return sha

    tree = [{"path": rel, "mode": "100644", "type": "blob", "sha": blob_for(rel, full)}
            for rel, full in files]
    save_cache(cache)
    print(f"tree entries: {len(tree)}", flush=True)

    try:
        base = api("GET", f"/repos/{REPO}/git/ref/heads/main")["object"]["sha"]
        base_tree = api("GET", f"/repos/{REPO}/git/commits/{base}")["tree"]["sha"]
        parents = [base]
        print(f"base commit: {base[:8]}", flush=True)
    except urllib.error.HTTPError:
        base_tree, parents = None, []
        print("empty repo: creating root commit", flush=True)

    tree_payload = {"tree": tree}
    if base_tree:
        tree_payload["base_tree"] = base_tree
    tree_sha = api("POST", f"/repos/{REPO}/git/trees", tree_payload)["sha"]
    commit = api("POST", f"/repos/{REPO}/git/commits",
                 {"message": MESSAGE, "tree": tree_sha, "parents": parents})
    print(f"commit: {commit['sha']}", flush=True)
    if parents:
        api("PATCH", f"/repos/{REPO}/git/refs/heads/main", {"sha": commit["sha"]})
    else:
        api("POST", f"/repos/{REPO}/git/refs",
            {"ref": "refs/heads/main", "sha": commit["sha"]})
    print(f"pushed to https://github.com/{REPO}/tree/main", flush=True)


if __name__ == "__main__":
    main()
