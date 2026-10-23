# Vortec staging mockup

Three linked static pages using the location page template navigation:

- `/` – Melbourne equipment location page
- `/vx2000/` – VX2000 Hydroseeder product page
- `/hydromulching-services/` – hydromulching services page

The dark staging strip links the pages without altering the reference header. All pages have `noindex, nofollow`. The VX2000 brochure modal downloads the bundled staging specsheet after local form validation. It does not send or store form data. Quote forms open an email draft, and the services contact button opens Vortec's live contact page.

## Local preview

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/` from this directory. Run `python3 scripts/check_site.py` and `node --check script.js && node --check site-header.js` before publishing.

## Deployment

The `main` branch deploys through `.github/workflows/deploy.yml` to GitHub Pages. In repository settings, set Pages **Build and deployment** source to **GitHub Actions**. The workflow validates the site and publishes only the static files and assets.

The staging PDF follows the [VX2000 product specifications](https://vortecglobal.com/product/vx2000-paddle-agitated-hydromulcher/) and [hydroseeder range](https://vortecglobal.com/hydroseeders/). Confirm final sales and form integrations before a production launch.
