# Workflow: Render Quote to PDF

Turn the finished quote markdown into a branded, print-ready PDF the user can
send. The PDF carries the user's logo and colors from `branding/brand.md`.

**The no-edit contract (read this first).** YOU emit ONE complete, styled HTML
quote — branding already applied, every number filled, nothing left blank. The
user (or their customer) never opens the HTML source and never edits it. Their
whole job is: open the file, Print, Save as PDF. There is no "paste your quote
into the marked area" step anywhere in this kit — you produce the finished page,
not a shell for someone to fill.

## 1. Read the branding

Open `branding/brand.md`. Pull:
- logo file (referenced by filename) — if there is one, place it in the header.
- primary color and accent color (hex).
- font preference and voice notes.

Read `branding/image-setup.md` to know the image lane. You do not generate a
new image here — you place the existing logo. If there is no logo, use the
brand's initials as a simple styled wordmark in the header (see step 3).

## 2. Build one styled HTML file

Create a single self-contained HTML file (all CSS inline in one `<style>`
block, no external files). Inline an SVG logo directly in the HTML or embed a
raster logo as a data URI. **Never reference a logo by filesystem path or URL**:
the PDF must still carry the brand when the HTML is moved or emailed. Layout:

- **Header:** the logo (or wordmark), business name in the brand's primary
  color, tagline and contact line beneath, a thin rule in the accent color.
- **Quote meta:** quote number, date, valid-until — right-aligned block.
- **Prepared for:** the client block.
- **Line-item table:** description, quantity, price each (right-aligned), line
  total (right-aligned). Subtotal, tax (only if present), total — total row in
  the accent color, bold.
- **Deposit and start window**, directly beneath the total and before Terms:
  "Deposit to start (40%): $5,383.46" and "Balance on completion: $8,075.18" as
  two plain right-aligned lines, then the agreed start window as one sentence.
  Set the deposit at normal body weight — this is the number that decides
  whether the job starts, so it never gets small grey treatment. Omit any of
  the three lines that has no value rather than printing an empty label.
- **Terms** block.
- **"What this quote does not include"** and **"What this price assumes"** —
  their own headed section after Terms, each as a short bulleted list, followed
  by the one-line change-order sentence from the template. Set them slightly
  smaller than body text but NOT grey-on-grey: this is the section a customer
  must actually be able to read, and burying it is how a contractor ends up
  eating a permit fee. **Never drop this section to make the quote fit one
  page** — drop margins first.
- Then the sign-off.
- Print-friendly: white background, dark text, ~0.5in margins via
  `@page { margin: 0.5in }`, no page-break inside the table.

Match the money exactly to the numbers you already verified — do not recompute
sloppily. Copy the totals you double-checked in `new-quote.md`.

Save the finished HTML into the user's OUTPUT folder — read `USER-CONFIG.md`
(the `output folder:` key; default `~/Documents/quote-kit/`) and write it there
as `RTC-<number>-<client>.html`. That folder is for finished quotes the user
opens in Finder/Explorer; it is NOT where the skill's working files live. On a
filesystem agent, write the file. On a chat app, produce the HTML as a
downloadable file the user saves into their own quote-kit folder.

## 3. If there is no logo

Do not fake a logo. Put a clean text wordmark in the header: the business name
(or its initials) set in the brand's primary color, bold, with the accent-color
rule beneath. This is the placeholder the branding interview promised the user
they can replace later by dropping a logo file into `branding/`.

## 4. Turn it into a PDF — plain-language steps for the user

Tell the user, in plain words:

> "Open this file in your web browser (double-click it). Then press
>  **Ctrl+P** (on Windows) or **Cmd+P** (on a Mac) to bring up Print. In the
>  printer dropdown, choose **Save as PDF** (sometimes called 'Print to PDF'),
>  then click Save. That gives you the finished quote as a PDF you can email."
>
>  On an iPhone or iPad: open the file, tap the Share icon, choose **Print**,
>  then pinch out on the preview and tap Share again to Save as PDF."

If you are a coding agent with a headless browser or a print tool available,
you may produce the PDF directly and hand the user the finished PDF — but the
browser-print steps above are always the reliable fallback and must be offered.

## 5. Verify the PDF before calling it done

If you produced the PDF yourself, open/inspect it: confirm the logo shows, the
colors match `branding/brand.md`, the table lines up, the total matches the
verified math, and **both the "does not include" and "assumes" lists are
present and legible**. A quote that looks off is not done, and a quote missing
its exclusions is not done either.

## 6. Hand it over

Give the user the PDF (or the HTML + print steps). Remind them: this is a draft
for THEM to send. When they confirm they are sending it, log it as **sent**
(`ledger-update.md`).
