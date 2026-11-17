# Tale Bruh daily Short: runbook

A scheduled session runs this once a day with nobody watching. Follow every step. Never stop to ask a question: if
something is unclear, take the safest choice, write it in `state/run-log.md`, and carry on. If a step cannot be done
(tool missing, render broken, upload refused), do not publish anything half-done: write what failed in
`state/run-log.md`, commit, push, and end the run.

Channel: Tale Bruh (@talebruh), channel id UCnddd50d5qBJ30dbvWKID6A. English, US/world audience.

## 0. Setup (about 3 min)
1. This repo is checked out. Tools: `bash /mnt/skills/plugins/faceless-shorts/scripts/setup.sh` (installs the Kokoro
   voice into `~/.faceless-shorts`). `S=/mnt/skills/plugins/faceless-shorts/scripts`.
2. Make the project (slug = short-kebab-name): `bash $S/new_video.sh paper-atlas <slug>`, then
   `cd ~/faceless-shorts/<slug> && cp <repo>/engine/extras.js src/ && mv src/shots.js /tmp/` and turn off the end fade
   (the Short must loop): `sed -i 's#const fade = Math.min(clamp(t / 0.25), clamp((T.dur - t) / 0.35));#const fade = 1;#' src/main.js`
   (check the line changed with grep). Voice/timing scripts take the slug: `$S/py $S/voice.py <slug>`, `$S/py $S/words.py <slug>`.
3. Render env: `export CHROME=$(ls -d /opt/pw-browsers/chromium-*/chrome-linux64/chrome | head -1)`.

## 1. Pick the topic
- Read `state/learnings.md` (what works on this channel) and `state/published.md` (never repeat a story).
- If `state/run-log.md` says a finished video failed to upload, upload that one first (step 5) and stop there.
- Take the first unchecked topic in `state/topics.md`. If none is left, research 10 new ones that fit
  `state/learnings.md` (true, surprising, one-line hook, visual: survival / record / bizarre history) and add them.
- **Verify the facts** with WebSearch (Guinness, Wikipedia, Britannica, major outlets). Every number on screen must be
  in a source. If sources disagree, use the safer wording ("about", "legend says"). If it can't be verified, mark it
  `[x] skipped: unverifiable` and take the next one.

## 2. Script (the format that works here)
- **13-18 s total. 6-8 lines, 45-60 words.** Voice `am_michael`, speed 1.1, `lead 0.15`, `gap 0.15`, `outro 0.4`.
- Line 1 = the whole shocking fact (the hook). No dates, places or set-up before it.
- One new fact every ~2 s. Never describe what the picture already shows.
- **Loop:** the last line is an unfinished sentence that runs straight into line 1
  (e.g. "...nobody wanted to stand next to" → "This man was struck by lightning seven times.").
- Captions: `caps` with `|` chunks of 2-4 words and one `*red` word each.
- Copy `examples/lightning.script.json` for the exact format; put the sources in `"sources"`.

## 3. Pronunciation (nobody can check it, so be strict)
- For every name, place or non-English word run
  `~/.faceless-shorts/venv/bin/python -c "from kokoro_onnx import Kokoro; import glob; d='/root/.faceless-shorts/kokoro/'; k=Kokoro(glob.glob(d+'*.onnx')[0],glob.glob(d+'*.bin')[0]); print(k.tokenizer.phonemize('NAME','en-us'))"`.
- If the phonemes are not the common English pronunciation, put a phonetic respelling in `text` (e.g. "Vesna Vulovich",
  "Mee-shell Lo-tee-toe") and keep the real spelling in `caps`. Prefer topics with plain names.

## 4. Build
1. Voice: `$S/py $S/voice.py <slug>` then `$S/py $S/words.py <slug>`. If the narration is over 19 s, cut words.
2. Write `src/shots.js`: one shot per line, built like `examples/lightning.shots.js` (helpers in `src/extras.js`
   from `engine/` and `src/core/kit.js`; more examples in `examples/`). Rules:
   - Frame 1 must already show the hook happening (an impact, a flash, a counter), never an empty scene.
   - Big subject: figures about 1000 px tall standing at y 1450. Paper slips at y 300-520; nothing below y 1500
     (captions live there).
   - Something changes on screen at least every 1.5 s. Each key word gets a visual hit 0.1-0.4 s before it
     (`words.json` times are estimates, so pull hits earlier).
   - The last shot ends on the same framing as shot 1 so the loop is seamless. `src/main.js` has no fade (keep it).
3. `node tools/capture.mjs check`, `node tools/capture.mjs cues`, `$S/py tools/mix.py .` (music `tension` or `bed`).
4. QA: `node tools/capture.mjs sheet review/all.jpg 0.5 8`, then **Read the image** and check: hook visible at 0.25 s,
   nothing covering captions, no empty or black frames, visuals match the words, the end frame matches the first.
   Fix and re-check (max 3 rounds).
5. Render: `node tools/capture.mjs video renders/short.mp4`. Check with ffprobe (h264, 1080x1920, 13-19 s) and
   `ffmpeg -i renders/short.mp4 -af volumedetect -f null -` (max about -1 dB). Final sheet:
   `ffmpeg -i renders/short.mp4 -vf "fps=2,scale=150:266,tile=16x3" review/final.jpg` and Read it.

## 5. Publish
1. Host the file where Zapier can download it, on the `media` branch (one file only, history replaced each time):
   `git fetch origin`, `git switch --orphan media-tmp`, `git rm -rf --cached . -q`, `mkdir -p media`,
   copy the mp4 to `media/<YYYY-MM-DD>-<slug>.mp4`, `git add media/<file>`, commit, `git push -f origin media-tmp:media`,
   then `git switch -f main`.
   URL: `https://raw.githubusercontent.com/siam-parvez/talebruh-shorts/media/media/<file>.mp4`.
   Check with `curl -sIL <url>` (status 200, right size).
2. Upload with Zapier (`inspect_zapier_actions` first; `selected_api: YouTubeV4CLIAPI`, `tool_name: youtube_upload_video`):
   title (under 60 chars, the hook, no lies), description = one line + a question that invites comments + `#shorts`,
   5-8 tags ending with `Tale Bruh`, `category_id "27"`, `privacy_status "private"`,
   `publish_at "<day>T14:00:00Z"` (8 PM Dhaka / 9 AM New York) where <day> is the first day, from today on, whose 14:00Z
   is still in the future AND that has no row yet in `state/published.md` (one Short per publish day),
   `made_for_kids "false"`, `notify_subscribers "true"`, `default_language "en"`, `default_audio_language "en"`,
   `embeddable "true"`, `license "youtube"`.
3. If Zapier says "throttled": wait 10 min, try once more. If it still fails, write it in `state/run-log.md` (with the
   media file name) so the next run uploads it first.
4. Verify with `youtube_make_api_get_request` GET `https://www.googleapis.com/youtube/v3/videos` with
   `id=<id>&part=status,contentDetails` (privacyStatus private, publishAt set, right duration).

## 6. Learn (every run, 1 call)
- GET `https://youtubeanalytics.googleapis.com/v2/reports` with `ids=channel==MINE`, last 28 days,
  `metrics=views,averageViewDuration,averageViewPercentage,likes,shares,subscribersGained`, `dimensions=video`,
  `sort=-views`. Update the numbers in `state/published.md`.
- On Mondays, rewrite `state/learnings.md` from the numbers: which hooks, topics and lengths got the highest
  `averageViewPercentage` and views, and what to do more or less of. Reorder `state/topics.md` to match.

## 7. Record and push
- Add a row to `state/published.md`, tick the topic in `state/topics.md`, add a dated line to `state/run-log.md`.
- `git add state && git commit -m "Daily short <date>: <title>" && git push origin main`.

## Never
- Never publish unverified facts, real people's photos, gore, or anything mocking victims.
- Never reuse another channel's script or footage. Stories are public history; scripts are ours.
- Never post more than one Short per day. Never change or delete older videos.
- Never put secrets, tokens or the owner's email in this repo (it is public).
