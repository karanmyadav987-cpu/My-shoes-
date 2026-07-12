# My Shoes Hub - Landing Page

A premium, production-ready, fully responsive marketing landing page built for **"My Shoes Hub"** located in Bardoli, Gujarat, India.

---

## 🚀 Environment Stack Substitution Notice

> [!IMPORTANT]
> **Stack Adjustment:** Because Node.js is not present in the local execution environment, we have built a high-fidelity **Static HTML5 + Tailwind CSS (via Play CDN) + Vanilla JavaScript** landing page.
> - This layout is served locally using Python.
> - An interactive contact form is fully wired up to a local Python backend that writes entries directly to `enquiries.json` (running on `localhost:8000`).
> - **Next.js Migration Prepared:** We have included a full Next.js App Router structure in the `next-migration/` folder along with a root `package.json`, `tailwind.config.js`, and `.env.example`. When Node.js is installed, you can transition this static page into a Next.js app in minutes.

---

## 🛠️ How to Run Locally

### 1. Launch the Local Server
Since Python 3 is installed on your system, you can spin up the custom server in one command:
```powershell
py server.py
```
This runs a hybrid development server that:
- Serves static files on **`http://localhost:8000`**.
- Intercepts POST requests to `/api/contact` and saves them to `enquiries.json` for validation testing.

### 2. Verify in Browser
Open [http://localhost:8000](http://localhost:8000) in your web browser. Test features like:
- **Responsive Layout**: Shrink your screen to 360px, 390px, and 768px to check mobile-first breakpoints.
- **Rental Calculator**: Drag the days slider to watch pricing update dynamically.
- **Enquiry Form**: Type incomplete data and watch validation errors fire; submit a valid inquiry and look inside `enquiries.json` in your root folder.

---

## 🖼️ Swapping Placeholder Assets

We have labeled all asset insertion points with code comments (e.g., `<!-- TODO: Swap ... -->` in HTML and `// TODO: ...` in JS).

1. **Shoe Images / Store Photos**:
   - Currently, cards load optimized high-res Unsplash links.
   - To use your own, copy your `.jpg` or `.png` photos into a new `images/` directory in the root.
   - Update URL paths inside `js/config.js` (for products) or `index.html` (for the hero and about section illustrations).
2. **Google Maps Embed**:
   - In `index.html` line 520, swap the `iframe src="..."` URL with your customized Google Maps sharing iframe embed code matching your store coordinates.
3. **Contact Details**:
   - All contact details (WhatsApp numbers, owner names) are centralized in `js/config.js`. Change them in one place to update the entire website automatically!

---

## 🚚 Next.js Migration Instructions

When Node.js is installed on your machine:
1. Open the directory in your shell.
2. Run installation:
   ```bash
   npm install
   ```
3. Copy config files:
   - Copy components from `next-migration/components` and `next-migration/app` into a standard Next.js directory.
   - Rename `.env.example` to `.env.local` and customize.
4. Launch the local dev server:
   ```bash
   npm run dev
   ```
5. Build production bundle:
   ```bash
   npm run build
   ```

---

## 📁 Directory Structure

```
[Project Root]
├── index.html            # Core HTML page (structured sections & SEO)
├── package.json          # Next.js workspace configurations
├── tailwind.config.js    # Tailwind theme extensions
├── server.py             # Custom local python dev server & API proxy
├── enquiries.json        # Submissions file created upon contact submit
├── .env.example          # Sample environment variables
├── README.md             # This document
│
├── css/
│   └── style.css         # Typography, custom animations, custom scrollbars
│
├── js/
│   ├── config.js         # Stores, contact info, and products configurations
│   └── app.js            # Validation engines, calculator logic, scroll triggers
│
├── api/
│   └── contact.py        # CGI script mockup for Apache environments
│
└── next-migration/       # React component codes ready for Next.js App router
    ├── app/
    │   ├── layout.tsx    # Next.js Metadata layout template
    │   └── page.tsx      # Main Next.js Home page structure
    └── components/
        ├── ShoeCard.tsx          # TypeScript Shoe Card component
        ├── RentalCalculator.tsx  # Dynamic React Rental Calculator
        └── ContactForm.tsx       # React Hook Form + Zod validator
```

---

## 🔒 Security & SEO Highlights
- **JSON-LD local schema**: Injected at the bottom of the HTML `<head>` tag for premium Google SEO rich snippets ranking.
- **Accessibility (a11y)**: Focus states are active, semantic elements (`<header>`, `<nav>`, `<section>`, `<footer>`) are used, image labels have clear alt descriptors, and contrast matches WCAG AA standards.
