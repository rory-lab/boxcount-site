# boxcount.co

Static rebuild of the Box Count website, replacing the Wix build.

## How it's organised

- `src/pages/` one file per page. The block between `---` lines sets the page title, meta description and URL.
- `src/layout.html` header, navigation and footer, shared by every page.
- `src/static/` stylesheet, script and images (`assets/`), copied as-is.
- `build.py` assembles the site into `dist/`.

## Hosting (Cloudflare Pages)

- Build command: `python3 build.py`
- Output directory: `dist`
- Cloudflare serves `people.html` at `/people`, so existing Wix URLs keep working.

## Before switching DNS

1. Add images to `src/static/assets/`: logo, portrait (`rory.jpg`), report cover, Pledge 1% and Disability Confident marks.
2. Move the Rights Holder Assessment code across from the Wix custom element.
3. Update the privacy policy: it still names Wix as host and cookie operator.
4. Decide whether the contact form gets its own Formspree form (it currently shares the Ladder's endpoint, tagged "Website contact form").
5. Recreate the Measurement page (`/effectiveness-measurement-toolkit`) or redirect it.

## Course bookings (Training page)

The booking form on `training.html` records the delegate's details (Formspree), then sends them to Stripe to pay. To switch payment on:

1. In Stripe, create a **Payment Link** for a product "Sponsorship Effectiveness Fundamentals" at £800 (one-off, quantity fixed at 1).
2. Under *After payment*, choose "Don't show confirmation page" and redirect to `https://www.boxcount.co/booking-confirmed`.
3. Turn on billing address collection, and tax/VAT settings if you are VAT-registered.
4. Copy the link (starts `https://buy.stripe.com/`) into `data-checkout=""` on the booking form in `src/pages/training.html`.

The form passes the delegate's email (pre-filled at checkout) and a booking reference (`client_reference_id`) so each Stripe payment can be matched to the details in Formspree.
Until the link is added, the form still captures bookings and tells the delegate you'll be in touch to complete payment.
