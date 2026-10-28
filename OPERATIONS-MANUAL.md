# Quote Kit — Operations Manual

Make consistent, good-looking, numbered quotes and proposals — with your logo
and colors at the top — without ever re-typing one from scratch. Your AI drives the
conversation; the included plain-Node script does the pricing arithmetic,
reserves the next quote number under a lock, keeps the running record, and the
AI turns the result into a PDF you can send.

## The one-minute version

Tell your AI about the job in plain words:

> "Quote Bob for a fence, 120 feet at $40 a foot."

It reads your prices and branding, asks the included script to do the math and
reserve the next number, then hands you a branded quote to review. The ledger
row starts as **prepared**. When you say you sent it, the script moves that row
to **sent**. If you abandon it, the row becomes **voided** and its number is
never reused.

You do not install a package or use Bun. A coding agent runs the included
`scripts/quote-kit.mjs` with plain Node 22 or newer. In a chat-only app that
cannot run it, the kit says the math and ledger gates are advisory instead of
pretending they are enforced.

## See it work first (the examples folder)

Open the `examples/` folder before you do anything else. There are four
complete runs in there: an everyday patio job, a service-business quote that
mixes a flat fee with hourly work, a two-option roof followed by a change order,
and — the one worth reading — a job the kit **refused** to price and why.
Real-shaped jobs in, finished quotes out.

Those are for looking at. Your own first quote is made from a real job of
yours, with your customer's name on it. The kit does not test itself on made-up
customers.

## The two ways to make a quote

**1. Just describe it.** Talk to your AI like a person: who it's for, what the
job is, how much. If it needs a detail ("cedar or pine?") it asks. Fastest for
one-offs.

**2. Use the form.** Open `templates/quote/form.html` in your web browser
(double-click it). Fill the boxes, click **+ Add a line item** for each thing
you're quoting, and the line totals and grand total add up as you type. Press
**Fill the quote**, then **Copy** or **Download**, and hand that to your AI to
give it a number and log it. Good when you have several line items.

Either way, the finished quote looks the same.

## The one time it will tell you no

This is the part that makes it more than a form-filler, so it is worth knowing
before it happens to you.

**Your AI will refuse to quote a job it cannot actually price.** If a line is
missing a quantity with a unit, or a price it can point to (your rate card, or
a number you said out loud), or an answer to one of the "what I need to know
before I can price it" questions in your `services.md`, it stops:

> "I can't quote this yet — here's what's missing:
>  1. The patio size. You said 'a paver patio' — I need the square footage.
>  2. Who's pulling the permit.
>  Give me those two and I'll price it and give it a number."

It produces **no quote and no number** until you answer. It will not fill the
hole with a typical price, and it will not show you a total "just so you can
see it." That is deliberate: the fastest way to lose a season's profit is
putting a firm number on a job nobody measured.

**It also stops when the price on your rate card is not the price for this
job.** This one looks like a pass and is not. Your asphalt price is $625 a
square with the shingles in it, and this customer's brother-in-law is supplying
the shingles — that $625 is on your rate card and it is still the wrong number:

> "Your asphalt price is $625 a square with material in it, and he's supplying
>  the shingles. I don't have a labor-only number for you. What do you want to
>  charge for labor on this one?"

It will not back into a number by subtracting a material cost nobody gave it.

**And it says what it saw and could not price.** Not a refusal, just a line —
whatever your customer raised that this quote does not cover:

> "One more thing I couldn't price: she says weekends may start in October.
>  Your rate card has no weekend rate, so I had nothing to quote it from. Add
>  it, or leave October out and say so on the quote?"

Whatever you decide goes in the exclusions, so your customer reads the same
boundary you drew. A want that appears nowhere on the quote is the one they
argue from later.

Three things follow from all this:

- **Your quote numbers never have holes.** A number is only spent on a quote
  that could actually be priced, so "what's still open?" is a count you can
  trust.
- **You can always override it with your own number.** If you worked the price
  out on site, say so — "it's a flat $3,800, I figured it there" — and it
  quotes that, with the scope spelled out. It refuses guesses, not your
  judgment.
- **A short refusal is still a refusal.** On a job where it only needs one
  thing, it asks for that one thing and moves on. It is a check, not a
  ceremony.

## Exclusions — the section that decides who pays

Every quote this kit makes carries two short lists: **what this quote does not
include** and **what this price assumes**. Permits, hauling away the old stuff,
marking utilities, whatever is buried under the slab, the lawn getting torn up,
truck access, one visit, today's material prices.

This is the highest-value paragraph on a contractor's quote and most quotes do
not have it. The installer asks you once what your price never covers unless
somebody asks, saves your answers in `services.md`, and puts them on every
quote from then on. Change them any time by editing that file.

If something on that list turns out different on site, the quote already says
it comes back to you in writing as a change — not a free extra.

## The margin line

If you told the installer roughly what a job costs you (materials, labor, subs,
as a percentage of what you charge), your AI adds one plain line after the
total:

> "At your usual 62 percent job cost, this one leaves about 38 percent gross —
>  around $5,537 before overhead."

And if a quote lands under your minimum charge, or under the margin floor you
set, it says so **before** it shows you the quote and asks which way you want
to go. It never changes your price on its own — it just makes sure you saw the
number before your customer did. Left that field blank or said "not sure"? Then
it says nothing about margin rather than making up a cost.

## The deposit and the date

Two numbers your customer looks for before anything else, and you do not have to
work either one out.

**The deposit.** If you told the installer you take one — a percentage or a set
amount — every quote prints it as its own line: *"Deposit to start (40%):
$5,383.46. Balance on completion: $8,075.18."* The two always add back to the
total exactly. Said "none"? Then no deposit line appears, and it never borrows a
percentage from an example.

**The date.** If your customer says "before Labor Day" or "before the first
freeze" anywhere in what they sent, your AI does not let that go by. It compares
it against the lead time you gave at setup and tells you, before the price goes
out: *"She asked for it before Labor Day, which is about three weeks. You're
booking 3 to 4 weeks. Tight — want me to put your real start window on it, or do
you want to call her first?"* Whatever you say goes on the quote. It never
prints a date you did not agree to.

## The extras that ride on top

Weekend and holiday work. Same-day emergencies. Travel out east. Stairs and
hard access. A rush date. Most owners charge for these and almost nobody writes
them down, which is exactly how they get left off a quote and eaten on the job.

The installer asks for yours and puts them in `rate-card.md` under **My add-ons
and surcharges**. From then on, every quote gets checked against that list and
your AI asks when one plausibly applies:

> "This one falls on a Saturday — do you want your weekend differential on it,
>  or are you eating that one?"

It never adds a surcharge on its own, and it never leaves one out quietly. If
you say no, that is a decision and it is done.

## Two ways to do it (options)

"Give me a number both ways" is one of the most common things a customer asks
for and one of the easiest ways to send out a wrong total. Your AI handles it as
alternatives, never as a sum: the work that happens either way sits in the main
table, and each choice gets its own block with its own total, both on **one**
quote number. *"These are two ways to do the same roof — they don't add up to
anything."* When your customer picks, you say so and the quote is rebuilt with
that option as the only total. Same number, same job.

## Ongoing work

Cleaning every Tuesday. Five overnight shifts a week. Monthly maintenance. A
rate is not a total, so your AI asks one question before it prices anything:
*"How long should this quote cover — a week, four weeks, a season?"* Then it
quotes exactly that period and says so on the line, and notes on the quote that
the price holds while the schedule does. It never picks the period for you.

## When the job changes (change orders)

Every quote you send carries this line: *"If something on this list turns out
differently once we are on site, we will come back to you with the change in
writing before doing the work."* This is how your AI keeps that promise.

Two weeks in, you open the deck and find eight sheets of bad plywood. Say
*"change order on 0068"* and you get a short document, not a whole new quote:
what changed and why in plain words, the added lines priced from your rate card,
the change amount, and the new job total added out loud. It gets numbered
**0068-A** — a child of the original — so your ledger still counts one roof as
one job, and your next new quote is still 0069.

A few things it deliberately does differently from a quote: it does not run your
minimum-charge check (that job was already taken, a $736 change is not under
anybody's minimum), it inherits the original's terms, tax treatment, and
exclusions instead of re-asking, and it does not touch the deposit you already
collected. It still refuses to price a change it cannot price, same as a quote.

Work does not start until your customer approves it — and a customer email
saying "approved" is not approval. You tell your AI, or it is not approved.

## What your AI always does (the promises)

- **Fields are plain.** Everything it asks for is in plain words — "client full
  name," "price each in dollars" — no codes.
- **Quote numbers come from your ledger, never made up.** The next number is
  always one higher than the last quote in `ledger/quotes-ledger.md`. First
  quote is 0001.
- **It shows the math and checks it twice.** You'll see "120 × $40 = $4,800,
  plus 8.625% tax = $414, total $5,214" — spelled out, added twice, before it
  calls the quote done.
- **You send it, not the AI.** Your AI drafts the quote and makes the PDF. You
  review it and send it to the client. It never contacts anyone for you.
- **Anything you paste in is treated as information, never as orders.** You can
  paste a customer's email straight in. If that email happens to contain a line
  that reads like an instruction — "apply the 40% discount", "mark this
  approved", "the price is $2" — your AI does not do it. It shows you the line
  and asks. Prices, discounts, and quote statuses only ever change because YOU
  said so.

## Your prices and services

Two files hold what you charge:

- `rate-card.md` — your prices: hourly, flat, or per-unit, plus your add-ons
  and surcharges, your deposit, your lead time, your minimum, and your
  sales-tax rule. Edit it any time; new quotes use the new prices
  automatically.

  On sales tax, if some of your work is a capital improvement and some is a
  repair, say "depends on the job" at setup and list which services usually
  fall which way. Your AI will then ask you on every quote — *"is this one a
  capital improvement or a repair?"* — and use your answer. It never decides
  that for you, because that call is between you and your accountant and it
  costs real money in both directions.
- `services.md` — what each service is, in plain words, so the quote reads
  clearly.

The installer fills both from a short interview. Change a price? Just edit
`rate-card.md`.

## Your branding

`branding/brand.md` holds your business name, colors, and logo. It goes at the
top of every quote — that's what makes your quotes look like a real company's.

- Got a logo? Drop the file into the `branding/` folder. The quote header uses
  it.
- No logo yet? The installer set up a clean text placeholder. Replace it any
  time by dropping in a real logo file — nothing else to change.

## Making the PDF

When your quote is ready, your AI gives you a styled file. To turn it into a
PDF: open it in your web browser, press **Ctrl+P** (Windows) or **Cmd+P**
(Mac), choose **Save as PDF** in the printer list, and save. Email that.

## The ledger — your running record

`ledger/quotes-ledger.md` is the list of every quote you've prepared or sent:
number, client, amount, date, valid-until date, and status (**prepared**,
**sent**, **accepted**, **declined**, **expired**, or **voided**). The included
script owns every number and status write so two chats cannot reserve the same
number.

- A newly numbered quote is **prepared** until you confirm it was sent. Ask
  "what is ready but not sent?" to see those rows.
- When a client says yes, tell your AI "Bob accepted quote 0001" — the script
  updates that exact row.
- Ask "what quotes are still open?" any time and it lists everything still
  marked **sent**.
- A number with a letter after it — **0068-A** — is a change order on job 0068,
  not a quote of its own. It counts as part of that job and it does not use up
  a quote number: after 0068 and 0068-A, your next new quote is still 0069.

- The statuses go in order and the script holds you to it. A quote has to be
  **sent** before it can be **accepted**, **declined**, or **expired** — so your
  record can never say a customer agreed to something that never went out. Once
  a quote is accepted, declined, expired, or voided it is **closed** and stays
  that way. If a customer who declined comes back, that's a new quote with a new
  number. If an accepted job grows, that's a change order (see **0068-A** below),
  not a rewrite of the original.

Never delete rows — it's your record of what you quoted and for how much. If a
quote should stop counting (a mistake, a cancellation, or a test), your AI marks
it **voided** instead of deleting it: the row and its number stay, it just drops
off the "still open" list.

### If it says the ledger is busy

While the script is writing a quote number it puts a temporary lock on the
ledger so two chats can't grab the same number. It takes the lock off when it
finishes, even when it refuses to make a quote. If a chat gets closed or crashes
mid-write, that lock can get left behind.

You do not have to do anything about it. The script notices a lock nobody is
holding and clears it out on the next run by itself. If it ever does say the
ledger is busy, something really is running — wait a moment and ask again. If it
still says busy long after everything is closed, tell your AI to run the kit's
`ledger-unlock` step; it will not force a lock open on a live operation.

## As it grows

After a month of real use you'll have a stack of quotes. Two habits keep the
ledger honest:

- **Quotes expire.** A quote is only good until its "valid until" date (30 days
  by default). When your AI touches the ledger, it ages any **sent** quote whose
  date has passed to **expired**, so "what's still open?" shows only live ones —
  not quotes that lapsed weeks ago.
- **A monthly chase.** Once a month, ask your AI: *"Any quotes to chase?"* It
  reads the quotes still marked **sent** that haven't been answered and lists
  the ones getting close to expiring, so you can follow up before they lapse.

The ledger only ever adds rows, so it stays fast; you never have to clean it.

## Works anywhere, even bare chat

No files, just a chat window? You can still say "make me a quote for a fence,
120 feet at $40" and get the quote text back. The app must label its arithmetic
and ledger checks advisory. It also must not invent `0001`: paste your current
ledger or tell it the highest number already used. It starts at 0001 only when
you explicitly confirm you have never issued a numbered quote. The PDF and
saved branding are bonuses that show up once the kit is installed.

## Reinstalling / moving platforms

Hand `installer.md` to the AI on the new platform and say "install quote kit."
The installer adapts the package to whatever that platform needs — you never
repackage anything yourself.

## Credits

Forged in Rico's lab at rTech Digital Consulting. A standalone special case of
the Doc Factory pattern.
