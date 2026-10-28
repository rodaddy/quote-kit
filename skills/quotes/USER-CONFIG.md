# User Config

The installer writes this file at install time and the skill reads it. It holds
any choice the user made during setup. One config file, fully-spelled-out keys.

The only setting today is where finished quotes are saved. This is an OUTPUT
location — the folder the user opens in Finder/Explorer to find their rendered
quote pages and PDFs. The skill WRITES finished quotes here; it never READS its
working files from here (those live inside this skill folder).

```
output folder: ~/Documents/quote-kit/
```

If the user picks a different folder during install, the installer replaces the
path above. The render workflow reads the `output folder:` key to know where to
save each finished quote.
