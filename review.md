(DONE)  Page transitions: replace the hack

  Current problems:
(DONE)  - The <a onclick="doTransition(...)"> links have no href. That means no keyboard focus, no middle-click or "open in new tab", no link preview on hover, and
    crawlers can't follow them.
(DONE)  - The 1300ms setTimeout has to stay in sync with the CSS by hand, and it already doesn't: .fade4 runs for 1.4s, so the last tiles get cut off.
(DONE)  - index.html uses onpageshow but the project pages use onload. onload doesn't fire when the back/forward cache restores a page, so going back to a project
    page can show a blank grid with every tile stuck at opacity 0. The hasLoaded flag was patching this on index only.
(DONE)  - The spinner and the 2s fallback only exist because onload waits for about 21MB of images (see Performance below).
(DONE)  - hasLoaded = false; is an implicit global.
(DONE)  - template.html is out of date: it uses location.replace, which breaks the back button.

(DONE)  Fix: cross-document View Transitions plus a CSS entry animation. This needs no JS at all.

  @view-transition { navigation: auto; }

  .box {
    animation: tile-in 0.5s ease-out both;
    animation-delay: calc(var(--i, 0) * 120ms);
  }
  @keyframes tile-in { from { opacity: 0; transform: translateY(8px); } }

  @media (prefers-reduced-motion: reduce) {
    .box { animation: none; }
    @view-transition { navigation: none; }
  }

  <a href="projects/surface.html" class="box link w2" style="--i:1">

(DONE)  - Links become real <a href>. You can delete main.js, the spinner, hasLoaded, the fade1–fade4 classes and the Chrome-transition-on-load workaround. That bug
    only affects transition, not animation.
  - The Metro bonus: give the cover tile on index and the header tile on the project page the same view-transition-name: surface;. The browser then morphs the
    tile into the page header, which is the Win8 "tile opens app" feel.
  - Support: Chrome/Edge 126+ and Safari 18.2+. Browsers without support (Firefox is behind here) just do a normal navigation with the CSS fade-in, so the
    fallback is fine.

  Code review

(DONE)  1. Grid sizing. The fixed height: 25vw on .box and the .h2 { height: calc(50vw + 42px) } magic number are fragile. Size the rows on the grid instead:
  #grid-container {
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 20vw;          /* or minmax(160px, 20vw) */
    grid-auto-flow: dense;         /* fills Metro holes automatically */
  }
  .w2 { grid-column: span 2; }
  .h2 { grid-row: span 2; }       /* no height math */
     dense is the key piece for mixed tile sizes. It back-fills gaps so you don't have to hand-order the tiles.
(DONE)  2. .centertile hack. top: 12.5vw + translate(-50%), and the "Safari can't do %" comment, are obsolete. Use .center { display: grid; place-items: center; 
     text-align: center; }. You can also drop .box p { position: absolute } and lay out with flex or grid.
     Note: .box p { position: absolute } was kept; it still places tile descriptions at the bottom.
(DONE)  3. background-size hover zoom. It repaints every frame, so it's janky, and it's why .bgcover "does not work with links". Use a real <img> in each tile with
     object-fit: cover and transform: scale(1.1) on hover. That's GPU-composited and works for every tile. You also get alt, loading="lazy" and srcset.
(DONE)  4. Stagger classes. Replace fade1–fade4 with one --i custom property (shown above).
     Note: fade1–fade4 were kept. The fade-out runs on view-transition snapshots, which can't read --i, so
     view-transition-class (set by these classes) is the only way to stagger it. The classes now drive both directions.
(DONE)  5. Patterns. The inline style="background-image:url('../images/patternN.png')" repeats everywhere, with ../ path juggling. Use .p1….p6 classes in the CSS,
     and the paths resolve relative to the CSS file once.
(DONE)  6. Duplicated header. The Home/Email/Resume tiles are copy-pasted into all 6 pages. A tiny custom element would remove that
     (customElements.define('site-nav', …), about 10 lines, no library). Or accept the duplication; it's honest at this size.
(DONE)  7. Dead or broken CSS: .grid-container in the media query is a class, but the element uses an id, so that rule never applies. Also dead: --img1, .box 
     p.right, and a lot of commented-out rules.
(DONE)  8. Deprecated HTML: <center>, bgcolor="black" and frameborder. Also target="_blank" on mailto: does nothing.
(DONE)  9. Accessibility: no alt on any <img>. Hover-only descriptions are invisible to keyboard users, so add :focus-visible next to :hover.
(DONE)  10. Typography: mixed pt and vw sizes. font-size: clamp(1rem, 2.3vw, 1.5rem) stops text getting tiny or huge. The font loads through @import in the CSS,
      which is render-blocking and chained. Either switch to <link rel="preconnect"> + <link>, or self-host woff2. The fonts/*.ttf files are unused. Also,
      Source Sans Pro is now called "Source Sans 3".

(DONE)  Performance (the root cause of the spinner)

  - The covers are about 15MB of 3000px PNGs, and the screenshots another 6MB, for tiles about 400px wide. Converting to WebP/AVIF at around 1200px brings
    each one to about 100–200KB, and the page becomes instant without a spinner.
  - Unused files you can delete:
    - fonts/*.ttf
    - images/background.jpg
    - images/covers/everest.png
    - images/covers/surface.psd (4MB)
    - images/shots/pp-flower.png
    - images/svg/eeg.svg, go.svg, go2.svg
    - images/titles/music-box.png
  - .DS_Store files are committed even though .gitignore lists them. Clear them with git rm --cached (**/.DS_Store).

  Design review (v2: bolder, not Windows)

  Diagnosis: the project art is great (cinematic, dark, saturated) but the frame around it is timid and dated. Everything is the same weight
  (Source Sans Light everywhere, similar sizes, same tile height, same 10px gap), and the decorative layer (pastel textured patterns, 8px radius,
  white glow on links) reads as 2012 scrapbook rather than intentional. Bold comes from contrast: big vs. small, heavy vs. light, one loud colour vs.
  black. Ordered by impact.

  1. A real type system. This is the single biggest lever.
     - Pair a display face with character for names and headings (e.g. Space Grotesk, Bricolage Grotesque or Archivo at 700–800) with a quiet body
       face (keep Source Sans 3 at 400, not 300; light grey-on-black at 300 is thin and hard to read).
     - Go big on the name: "Liam Brady" at clamp(3.5rem, 9vw, 8rem), tight letter-spacing (-0.03em), line-height 0.9. One oversized line does more
       than any decoration.
     - Invert the tile hierarchy: project titles are currently weight 300 and the captions are almost as large. Titles bold, captions ~1rem.
     - Section labels left-aligned and editorial, e.g. a small numbered kicker ("01 / Games") above a large heading, instead of small centred text.

  2. Replace the pastel patterns with one strong palette.
     - Black base, off-white text, and ONE signature accent (an electric colour that holds up against the art: acid yellow-green, hot coral, or
       Surface's cyan). Use it sparingly: links, tags, the stat numbers, hover states.
     - Optional per-project accent pulled from each cover (Surface cyan, iColtrane magenta, Paper Plane amber, iMat blue, Music Box violet), set as
       --accent on the page's <body>. Each project page then has its own colour while the system stays the same.
     - Drop the pattern PNGs, the glow box-shadows, and the #ddd frame around video embeds. Corners 0–4px. Hover = image zoom + a 2px accent outline.

  3. Make the hero a statement, and use your drawing.
     - The hand-drawn self-portrait (mecircle.png) is a distinctive personal mark nobody else has. Put it in the hero next to the giant name. Line art
       ties into the "art + tech" pitch better than another photo does, and it now matches the favicon.
     - Extend the hand-drawn line as a small motif: a scribbled underline under the name, a drawn arrow toward "projects below". Use it two or three
       times, no more.
     - Hero copy as one short, punchy line under the name ("Security engineer on Chrome. Builds instruments and games after hours."), with the longer
       paragraph below it at body size.

  4. Project pages: numbers instead of clip-art icons.
     - The pastel icon tiles (brain, Unity logo, piano) feel generic. Lead with big typographic stats in the accent colour: "25th of 1,145", "48 hrs",
       "15 sensors", "24 LEDs", each with a one-line caption. Huge numerals are bolder and more specific than icons.
     - Add a meta strip under the title: year, role, tools, and the Play/Source links as buttons (right now they're buried at the bottom).
     - End every project with a full-width "Next project →" tile showing the next cover, so people keep browsing instead of bouncing.
     - Body text: left-align it (justified text makes rivers) and don't put it in fixed-height tiles. The iColtrane description is currently cut off
       mid-sentence ("…a different note in the tone").

  5. Break the grid rhythm.
     - Every tile is the same height with the same gap, so nothing leads. Make one feature project much bigger (Surface, the award winner, could be
       full-width and taller) and give the others different sizes.
     - Give sections more black space between them (e.g. 96px) than tiles get inside a section (10px). Grouping by space is what makes a grid look
       designed.
     - Let one image per page go full-bleed (edge to edge, no gap) for drama.

  6. Lighter nav.
     - Five chunky pastel tiles at a 30px font are the loudest thing on the page and they're the least important. Use a slim top bar instead: the
       doodle face plus "Liam Brady" on the left, small text links on the right (Resume, GitHub, LinkedIn, Email), accent underline on hover.

  7. One signature interaction (pick one, keep it subtle).
     - The doodle face's eyes follow the cursor or blink occasionally (an SVG version of the drawing makes this easy). It's personal, memorable, and
       on-message for someone who does art + tech.
     - Or tiles tilt slightly toward the cursor on hover (respect prefers-reduced-motion).

  Suggested order: 1 + 2 together (type + palette, mostly CSS), then 3 (hero), then 4 (project pages), then 5–7.

  Content and UX:
(DONE)  - Descriptions only show on hover, but recruiters skim. Show them always, on a bottom gradient scrim (linear-gradient(transparent, rgba(0,0,0,.7))). White
    text on bright cover art is currently unreadable without one.
(DONE)  - There are no GitHub or LinkedIn tiles. Add them; they're the first things recruiters click.
(DONE)  - The hero should say what role you're after ("software engineer focused on X"). "Too many hobbies" is charming, but it shouldn't be the only line.
(DONE)  - Add tech tags to the tiles (Unity, Max/MSP, Arduino) so people can scan your skills from the home page.
(DONE)  - Project pages are inconsistent: some headers use title images, others an <h1>. Pick one.
(DONE)  - Typos: "sountrack" (plane), "meteoroids" (surface), "with using 3 blue buttons" (iColtrane), "lowpoly" → "low-poly".
(DONE)  - Add og:title, og:image and a favicon, so a pasted link shows a preview card in recruiter Slack or email.
