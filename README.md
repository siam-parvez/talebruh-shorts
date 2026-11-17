# talebruh-shorts

Automated daily pipeline for the Tale Bruh YouTube Shorts channel: topic, fact check, script, AI voice,
cut-paper animation, render, upload. A scheduled Claude session runs `RUNBOOK.md` once a day.

- `engine/`: our extra cut-paper pieces (the renderer itself comes from the faceless-shorts skill at run time)
- `examples/`: finished scripts and shot lists to copy from
- `state/`: topic queue, published log, learnings, run log
- `media` branch: holds only the latest video file so the uploader can fetch it
