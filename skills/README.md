# skills/

The installable skill payload of the Quote Kit. Everything the skill reads lives
inside this folder, so its relative paths resolve wherever the user is.

Holds `quotes/`, the one skill in this kit. The installer copies it recursively
into the AI's skills directory (`~/.claude/skills/`, `~/.codex/skills/`, or the
platform equivalent).
