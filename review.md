  Page transitions: replace the hack

  Current problems:
  - The <a onclick="doTransition(...)"> links have no href. That means no keyboard focus, no middle-click or "open in new tab", no link preview on hover, and
    crawlers can't follow them.
  - The 1300ms setTimeout has to stay in sync with the CSS by hand, and it already doesn't: .fade4 runs for 1.4s, so the last tiles get cut off.
  - index.html uses onpageshow but the project pages use onload. onload doesn't fire when the back/forward cache restores a page, so going back to a project
    page can show a blank grid with every tile stuck at opacity 0. The hasLoaded flag was patching this on index only.
  - The spinner and the 2s fallback only exist because onload waits for about 21MB of images (see Performance below).
  - hasLoaded = false; is an implicit global.
  - template.html is out of date: it uses location.replace, which breaks the back button.

  Fix: cross-document View Transitions plus a CSS entry animation. This needs no JS at all.

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

  - Links become real <a href>. You can delete main.js, the spinner, hasLoaded, the fade1–fade4 classes and the Chrome-transition-on-load workaround. That bug
    only affects transition, not animation.
  - The Metro bonus: give the cover tile on index and the header tile on the project page the same view-transition-name: surface;. The browser then morphs the
    tile into the page header, which is the Win8 "tile opens app" feel.
  - Support: Chrome/Edge 126+ and Safari 18.2+. Browsers without support (Firefox is behind here) just do a normal navigation with the CSS fade-in, so the
    fallback is fine.

  Code review

  1. Grid sizing. The fixed height: 25vw on .box and the .h2 { height: calc(50vw + 42px) } magic number are fragile. Size the rows on the grid instead:
  #grid-container {
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 20vw;          /* or minmax(160px, 20vw) */
    grid-auto-flow: dense;         /* fills Metro holes automatically */
  }
  .w2 { grid-column: span 2; }
  .h2 { grid-row: span 2; }       /* no height math */
     dense is the key piece for mixed tile sizes. It back-fills gaps so you don't have to hand-order the tiles.
  2. .centertile hack. top: 12.5vw + translate(-50%), and the "Safari can't do %" comment, are obsolete. Use .center { display: grid; place-items: center; 
     text-align: center; }. You can also drop .box p { position: absolute } and lay out with flex or grid.
  3. background-size hover zoom. It repaints every frame, so it's janky, and it's why .bgcover "does not work with links". Use a real <img> in each tile with
     object-fit: cover and transform: scale(1.1) on hover. That's GPU-composited and works for every tile. You also get alt, loading="lazy" and srcset.
  4. Stagger classes. Replace fade1–fade4 with one --i custom property (shown above).
  5. Patterns. The inline style="background-image:url('../images/patternN.png')" repeats everywhere, with ../ path juggling. Use .p1….p6 classes in the CSS,
     and the paths resolve relative to the CSS file once.
  6. Duplicated header. The Home/Email/Resume tiles are copy-pasted into all 6 pages. A tiny custom element would remove that
     (customElements.define('site-nav', …), about 10 lines, no library). Or accept the duplication; it's honest at this size.
  7. Dead or broken CSS: .grid-container in the media query is a class, but the element uses an id, so that rule never applies. Also dead: --img1, .box 
     p.right, and a lot of commented-out rules.
  8. Deprecated HTML: <center>, bgcolor="black" and frameborder. Also target="_blank" on mailto: does nothing.
  9. Accessibility: no alt on any <img>. Hover-only descriptions are invisible to keyboard users, so add :focus-visible next to :hover.
  10. Typography: mixed pt and vw sizes. font-size: clamp(1rem, 2.3vw, 1.5rem) stops text getting tiny or huge. The font loads through @import in the CSS,
      which is render-blocking and chained. Either switch to <link rel="preconnect"> + <link>, or self-host woff2. The fonts/*.ttf files are unused. Also,
      Source Sans Pro is now called "Source Sans 3".

  Performance (the root cause of the spinner)

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

  Design review

  Lean harder into Metro. Right now the site mixes Metro with skeuomorphic touches: 8px radius, white glow shadows, textured PNG patterns. Real Metro was
  flat:
  - Square or near-square corners (0–2px), no glow shadows.
  - Solid accent colours instead of pattern textures. Pick one per project or category.
  - Section labels as plain text headings, not tiles. Win8 put group names above tile groups. The .mini 24px tiles with a 30px font are fighting this.
  - A press-tilt effect: .box:active { transform: scale(.97) }, or a small perspective rotation toward the click.
  - "Live tiles": a CSS keyframe that flips a project tile between its cover and a one-line description every few seconds. It's pure CSS and very on-theme.
  - Four tile sizes are enough: 1×1, 2×1, 1×2, 2×2. Use 4 columns on desktop, 2 on mobile (Metro phone used 2 small columns). The current mobile layout is 1
    column of identical 40vw boxes, which loses the grid character entirely.

  Content and UX:
  - Descriptions only show on hover, but recruiters skim. Show them always, on a bottom gradient scrim (linear-gradient(transparent, rgba(0,0,0,.7))). White
    text on bright cover art is currently unreadable without one.
  - There are no GitHub or LinkedIn tiles. Add them; they're the first things recruiters click.
  - The hero should say what role you're after ("software engineer focused on X"). "Too many hobbies" is charming, but it shouldn't be the only line.
  - Add tech tags to the tiles (Unity, Max/MSP, Arduino) so people can scan your skills from the home page.
  - Project pages are inconsistent: some headers use title images, others an <h1>. Pick one.
(DONE)  - Typos: "sountrack" (plane), "meteoroids" (surface), "with using 3 blue buttons" (iColtrane), "lowpoly" → "low-poly".
  - Add og:title, og:image and a favicon, so a pasted link shows a preview card in recruiter Slack or email.
