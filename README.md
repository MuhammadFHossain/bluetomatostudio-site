# bluetomatostudio.com

One page for the design house. It says what we are, lists the apps, points at
each one's own site, and gives one email address. That is the whole job.

Plain HTML and CSS. No build step, no npm, nothing to install. You edit a file,
you push it, it is live in about a minute.

```
index.html          the page
404.html            the page people get when a link is wrong
assets/styles.css   every colour, size and spacing rule
assets/img/         the painted tomato, the three app icons, the favicon,
                    the marker swipe, the sharing picture
assets/stickers/    the hand-drawn creatures. Same set as the aloud app.
assets/fonts/       Fraunces for headings, Kalam for the handwritten bits
og-render.html      not a real page. The source for the sharing picture.
CNAME               the domain. Do not delete this file.
```

The look, in one line: bright white paper, a painted tomato, wonky Fraunces,
handwriting in the margins, and boxes drawn twice by hand.

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

The three sections, in order:

- **Hero** — the big line, the sentence under it, and the painting.
- **The apps** — the cards.
- **Say hello** — one line and one email address, `contact@bluetomatostudio.com`.
  App questions and work enquiries both go there. Do not add a second address.

---

## Rebuilding the pictures

Only needed if you change the mark, the headline, or the app icons.

The sharing picture, the one that shows up when someone pastes the link into a
message. Run this from inside the site folder:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --screenshot=assets/img/og.png --window-size=1200,630 "file://$PWD/og-render.html"
```

The sharing picture and both icons are built by a short Python script using
Pillow, because headless Chrome is unreliable on this Mac. The script lives in
the commit history for "the painting"; the short version is:

- `assets/img/tomato-art.png` is the painting, full size, transparent behind it.
- `assets/img/mark.png` is the same painting cropped tight to the fruit.
- `assets/img/og.png` puts the mark, the headline and the painting on white.
- `favicon-64.png` and `apple-touch-icon.png` are `mark.png` on white with a
  small margin. They need a white background baked in, because iOS composites a
  transparent home-screen icon onto black.

If you repaint the tomato, replace `tomato-art.png`, re-crop `mark.png`, and
rebuild those three.

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

Every colour here was picked off the painted tomato itself.

| | |
| --- | --- |
| Page, bright white | `#FFFFFF` |
| Text | `#16202B` |
| Blue, for links and buttons | `#0071C7` |
| Bright blue, big shapes only | `#0F8CE8` |
| The softest blue wash | `#EAF4FD` |
| Leaf green | `#5E7817` |

**There is no dark mode, and there should not be one.** The painting is a
bright object on white paper and it does not survive being inverted, so the site
stays light whatever the reader's Mac is set to. Do not add a
`prefers-color-scheme` block back in.

**The tomato is blue.** That is the name and the whole joke. There is no red
anywhere on this site and there should never be. If you are adding something and
reach for an accent colour, it is one of the blues above.

The paper stays bright white. The painting is the only picture that is ours, and
the three app icons are navy, teal and green. If the page itself picks up
colour, they all fight each other.

**Type.** Headings are Fraunces with its `WONK` axis on, which is the setting
that gives it the odd curled leg. Little labels, the nav and the platform tags
are Kalam, which is handwriting. Body copy is whatever the reader's device uses:
it loads instantly and stays quiet between the two.

**The drawn boxes.** Two things do this, both in `styles.css`. `--wobble` and
`--wobble2` are eight different corner radii so no corner matches another, and
`.app::before` is a second outline sitting a few pixels out and leaning half a
degree, because anyone drawing a box by hand goes round twice and the lines
never quite meet.

**The stickers.** `assets/stickers/`, Farhan's own drawings, the same set the
aloud app uses. They are decoration and nothing else, so every one of them
carries `alt=""` and `aria-hidden="true"`. Two or three on a page is plenty. Any
more and it stops being a design house and starts being a scrapbook.

Always use the **`-solid`** file, never the plain outline. The originals are
line drawings with nothing behind the lines, so a card edge runs straight
through the middle of a face. The `-solid` versions have the inside of the
animal filled with paper.

To make a new one: flood the transparent area in from the frame, and anything
the flood could not reach is inside the animal, so it gets white. Two catches.
The stroke is soft at the edges, so count anything above about 25 alpha as wall
and thicken it, or the flood squeezes through the outline. And a drawing cropped
at its own frame is an open shape, so it needs that edge treated as a wall too.
The cat, the walrus, the elephant and the snail cannot be filled this way, so
they are not used. Three that can: the bean, the dog and the fox.

One more trap: `index.html` loads the stylesheet as `styles.css?v=…`. **Bump
that tag every time you change the CSS.** Leave it alone and the browser keeps
serving the old file, and you spend an evening wondering why a change you can
see in the source is not on the page.

**The scribble** under "design house" is `assets/img/marker.svg`, five passes of
a marker going back and forth. It is stretched to fit the word, so its aspect
ratio is deliberately not preserved. The white gaps between the passes are what
make it read as a scribble. Squash it below about `0.7em` tall and the passes
merge into a flat bar.

---

## Checking it before you push

```bash
python3 -m http.server 4190
```

Then open `http://localhost:4190`. Worth looking at the page narrow as well as
wide, and in dark mode, before pushing.
