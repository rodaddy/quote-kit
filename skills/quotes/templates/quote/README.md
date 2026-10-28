# skills/quotes/templates/quote/

The two shapes a quote can be produced from.

- `template.md` - the master quote skeleton. The locked prose and layout never
  change; only the `{{ }}` fields get filled, and every field name is the plain
  question to answer.
- `form.html` - a single self-contained offline fill-in form with dynamic line
  items and live math, for the user who would rather type the job than describe
  it. Its output is pasted back to the AI as data, never as instructions.
