# Sproutime website

The public information site for **Sproutime**, a quiet, offline-first focus timer for Android.
It includes a launch page, a Play Console–ready privacy policy at `/privacy/`, and a support page
at `/support/`.

Everything is static: plain HTML, one CSS file, one small JavaScript file, self-hosted fonts, and
real app screenshots. No build step, no framework, no backend, no cookies, no analytics, and no
third-party scripts.

---

## Preview locally

From this `sproutime-website` folder:

```powershell
python -m http.server 8080
```

Then open <http://localhost:8080>. A local server is recommended over double-clicking the files so
that directory URLs such as `/privacy/` resolve the same way they will in production.

To stop the server, press `Ctrl+C`.

---

## File map

```text
sproutime-website/
├─ index.html                  Landing page
├─ 404.html                    Friendly not-found page
├─ privacy/index.html          Privacy policy (Play Console URL: /privacy/)
├─ support/index.html          Support and FAQs (/support/)
├─ robots.txt
├─ sitemap.xml
├─ .nojekyll                   Tells GitHub Pages to serve files as-is
├─ assets/
│  ├─ css/styles.css           All styling, tokens, responsive rules, print styles
│  ├─ js/main.js               Navigation, reveal motion, TOC scrollspy, config values
│  ├─ fonts/                   Subset Inter + Inter Display WOFF2, OFL licence
│  └─ img/
│     ├─ icon.svg              Vector app icon
│     ├─ icon-192.png / icon-512.png
│     ├─ apple-touch-icon.png / favicon-32.png
│     ├─ og-image.png          1200 × 630 social preview
│     └─ screenshots/          Real emulator captures, 1080 × 2400
└─ README.md
```

---

## Before publishing: required edits

### 1. Site configuration (`assets/js/main.js`)

Open `assets/js/main.js` and fill in the `SITE_CONFIG` block at the top.

| Value | What to enter | What happens if it stays empty |
| --- | --- | --- |
| `PLAY_STORE_URL` | Full Google Play listing URL, e.g. `https://play.google.com/store/apps/details?id=com.sproutime.app` | The button stays an honest “coming soon” note. No fake store link is shown. |
| `CONTACT_EMAIL` | A monitored public support address, e.g. `hello@sproutime.app` | The site shows highlighted `[contact email]` placeholders. |
| `EFFECTIVE_DATE` | The privacy policy's effective date, e.g. `4 November 2026` | The policy shows highlighted `[effective date]` placeholders. |
| `DEVELOPER_NAME` | The developer or legal entity name used in Play Console | The policy shows highlighted `[developer legal name]` placeholders. |

These values are plain strings in one file; there is nothing to rebuild. After editing, reload the
page. The highlighted yellow markers disappear as each value is supplied.

### 2. Legal and identity details

These cannot be invented and must be supplied by the app owner:

- [ ] **Developer legal name** — the person or company that publishes the app.
- [ ] **Business address** — a contact address suitable for a public privacy policy.
- [ ] **Contact email** — public, monitored, and the same address declared in Play Console.
- [ ] **Effective date** — the date the policy goes live.
- [ ] **Target audience / age rating** — confirm the app is general-audience and not directed to
      children under 13. The policy states this as the current position.
- [ ] **Jurisdiction review** — have the final policy checked for the countries where you distribute
      the app. The page is a careful draft, not legal advice.
- [ ] **Data Safety form** — answer “no data collected / no data shared” for app content, with Google
      Play Billing handled as the purchase processor. Confirm this against the final build.
- [ ] **Google Play URL** — use the real listing URL after the app is published.
- [ ] **Domain** — replace `https://example.com` in `sitemap.xml` and `robots.txt`, and add a
      canonical link plus `og:url` to each page once the domain is known.

Search the project for `[` to find every visible placeholder:

```powershell
Select-String -Path .\index.html,.\privacy\index.html,.\support\index.html -Pattern '\[(developer|business|contact|effective|add|your)'
```

### 3. Play Console readiness

For the **Store listing → Privacy policy** field, use:

```text
https://YOUR-DOMAIN/privacy/
```

The page currently covers, accurately for the built app:

- what is stored locally and why;
- the absence of accounts, analytics, ads, telemetry, and cloud sync;
- the single network use — Google Play Billing;
- each Android permission and its purpose;
- retention, deletion in the app, and uninstall behaviour;
- children's privacy, security, international transfers, and change handling;
- contact details.

Still needed before submission: the four identity values above, the final domain, and a legal review
for your target markets.

---

## Publish with GitHub Pages

These steps assume you want the site at a public URL without a custom domain.

1. Create a new **public** GitHub repository, for example `sproutime-site`.
2. Upload the **contents of this folder** — not the parent project and not the Android app.
   Keep the folder structure exactly as it is (`privacy/index.html`, `assets/...`, and so on).
3. Commit to the `main` branch.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch **main** and folder **/ (root)**, then **Save**.
7. Wait for the deployment to finish. The URL will look like
   `https://USERNAME.github.io/sproutime-site/`.
8. Open the URL and check the home page, `/privacy/`, `/support/`, a screenshot, and the 404 page.
9. Update `robots.txt` and `sitemap.xml` with the real URL, and add canonical/`og:url` tags.
10. Optionally add a custom domain under **Settings → Pages → Custom domain** and enable
    **Enforce HTTPS** once DNS is ready.

Because every link in the site is relative, it works both at a domain root and in a project
subdirectory such as `/sproutime-site/`.

### Using the command line instead

From this folder:

```powershell
git init
git add .
git commit -m "Add Sproutime website"
git branch -M main
git remote add origin https://github.com/USERNAME/sproutime-site.git
git push -u origin main
```

Then follow steps 4–10 above.

### If you use Netlify, Cloudflare Pages, or Vercel

- Build command: none
- Output / publish directory: the `sproutime-website` folder (or repository root if the repo
  contains only these files)
- No environment variables are needed.

---

## Design and implementation notes

- **Palette** follows the app's Meadow theme: warm ivory `#faf7f0`, paper `#fffdf8`, forest green
  `#1f7a45`, deep ink `#101710`, sage `#9fd3ae`.
- **Type** is Inter and Inter Display, self-hosted as subset WOFF2 with the OFL licence included.
- **Illustrations** are inline SVG, so there are no extra image requests.
- **Screenshots** are unedited captures from a running Android emulator at 1080 × 2400, including the
  real status bar and navigation bar.
- **Motion** is subtle: gentle floating cards, reveal-on-scroll, and a soft sway. It is fully disabled
  under `prefers-reduced-motion`.
- **Accessibility**: skip link, landmarks, visible focus rings, alt text, labelled navigation,
  keyboard-operable menu, `aria-expanded`, `aria-current`, and a print stylesheet for the policy.
- **No cookies, storage, analytics, tracking pixels, or remote requests.** The only outbound links
  are to Google Play and Google's policies, and they open only when clicked.
- **SEO**: unique titles and descriptions, Open Graph and Twitter cards, `SoftwareApplication`
  structured data, `robots.txt`, and a three-URL sitemap.

### Replacing a screenshot

Keep the same filename in `assets/img/screenshots/` and roughly the same 1080 × 2400 aspect ratio.
If the dimensions change, update the `width` and `height` attributes in the HTML to avoid layout
shift. The `alt` text should describe the new screen accurately.

### Adding a page later

Copy the header and footer from `support/index.html`, change the relative prefix (`../` for a
subpage), set a unique `<title>` and description, and add the page to `sitemap.xml`.

---

## Current status

- The app is **not yet on Google Play**. The site does not claim it is, and it contains no invented
  store URL.
- Plans are described with the prices currently defined in the app, clearly marked as planned and
  confirmed in Google Play at checkout.
- No deployment or publishing has been performed.
- The privacy policy is complete in structure and accurate to the app's implementation, but still
  needs the legal identity, contact email, effective date, domain, and jurisdiction review listed
  above.
