# bluetomatostudio.com

One page. It lists the apps and points at each one's own site. That is the whole job.

Plain HTML and CSS. No build step, no npm, nothing to install. You edit a file,
you push it, it is live in about a minute.

```
index.html          the page
404.html            the page people get when a link is wrong
assets/styles.css   every colour, size and spacing rule
assets/img/         the three app icons, the favicon, the sharing picture
assets/fonts/       Fraunces, the heading font
og-render.html      not a real page. The source for the sharing picture.
CNAME               the domain. Do not delete this file.
```

---

## Adding a new app

Five things change. Nothing else.

1. Put the app's icon in `assets/img/`. Name it `app-<name>.png`.
   From a 1024 icon: `sips -Z 512 assets/img/app-newapp.png`
2. Open `index.html` and find the block marked `<!-- ===== APP CARD ===== -->`.
3. Copy the whole block, from `<a class="app"` down to its `</a>`.
4. Paste it under the last app card.
5. Change the five spots. They are numbered in the comments:

| Spot | What to change |
| --- | --- |
| 1. picture | `assets/img/app-newapp.png` |
| 2. name | what the app is called |
| 3. what it runs on | `Mac`, `iPhone`, `iPhone and iPad`, `Android` |
| 4. one line | what it does, said plainly. Two sentences at most. |
| 5. where it goes | the app's own web address, twice: once in `href` at the top, once as the visible text |

Also add the app to the footer link list at the bottom of `index.html`, next to
Slate, Hifz Quran and aloud.

The cards lay themselves out. Three across on a laptop, one under the other on a
phone. A fourth app wraps to a second row on its own.

### Writing the one line

House rules, so the page keeps sounding like one person wrote it:

- Say what it does, not how good it is.
- Short words. If a nine year old would not use it, pick another one.
- No dashes in the middle of a sentence. Use a full stop.
- Do not give the app feelings or let it want things.
- Skip: seamless, effortless, powerful, beautifully crafted, unlock, elevate,
  revolutionise, journey, thoughtfully designed. All of it reads as filler.

Good: "A diary you talk into. Say how your day went for twenty seconds and it
comes back as a few handwritten lines."

---

## Changing the words on the page

Everything is written straight into `index.html`. There is no database and no
content file to find. Search for the sentence you want to change and change it.

The four sections, in order:

- **Hero** — the big line and the sentence under it.
- **The apps** — the cards.
- **Three rules we keep** — the promises that are true of every app. If one ever
  stops being true, take it off this page the same day.
- **Say hello** — the two contact cards.

---

## Rebuilding the pictures

Only needed if you change the mark, the headline, or the app icons.

The sharing picture, the one that shows up when someone pastes the link into a
message. Run this from inside the site folder:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --screenshot=assets/img/og.png --window-size=1200,630 "file://$PWD/og-render.html"
```

The favicon is `assets/img/favicon.svg`, drawn by hand in the file. The two PNG
copies next to it are for older browsers and for the iPhone home screen. Rebuild
them the same way, from a small page that holds just the mark.

---

## Putting it live

The site sits on GitHub Pages, same as the other three.

```bash
git add -A && git commit -m "what changed" && git push
```

Give it a minute, then hard refresh the page.

First time only, in the repo on github.com:

1. Settings, then Pages.
2. Source: Deploy from a branch. Branch: `main`, folder: `/ (root)`.
3. Custom domain: `bluetomatostudio.com`. Tick Enforce HTTPS once it lets you.

And at whoever holds the domain, point these at GitHub:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | muhammadfhossain.github.io |

The HTTPS certificate takes up to a day the first time. That is normal.

---

## The email

`contact@bluetomatostudio.com` is on the page in three places: both contact
cards, the footer link, and the footer line.

It does not need its own mailbox. Forward it to `contact@farhanhossain.com` and
set that up to reply as the studio address, so everything lands in one place.

---

## Colours and type

All of it lives at the top of `assets/styles.css`, in one block. Change a value
there and it changes everywhere on the page. Never write a colour into
`index.html`.

| | Light | Dark |
| --- | --- | --- |
| Page | `#FBFAF7` | `#15171E` |
| Text | `#191C24` | `#E9E7E1` |
| The blue | `#243652` | `#9DB8E0` |
| The tomato | `#C8452C` | `#E8735A` |

Dark mode follows the reader's Mac or phone. There is no switch to build.

The page stays paper and ink on purpose. Three app icons sit on it and they are
navy, teal and green. If the page itself picks up colour, they fight it.

Headings are Fraunces, the same face as the aloud and Hifz Quran sites, so the
four sites read as a family. Body text is whatever the reader's device uses.
That is a choice, not a shortcut: it loads instantly and it stays out of the way
of the three app brands.

---

## Checking it before you push

```bash
python3 -m http.server 4190
```

Then open `http://localhost:4190`. Worth looking at the page narrow as well as
wide, and in dark mode, before pushing.
