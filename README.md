# Beam Landing Page

Professional quotes in seconds, not hours.

## Quick Start

```bash
# Open locally
open index.html

# Or serve with Python
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Deployment Options

### Netlify (Recommended - Free)
1. Create account at [netlify.com](https://netlify.com)
2. Drag & drop the `estimator-landing` folder
3. Done! You'll get a URL like `beam-xyz.netlify.app`
4. Optionally add custom domain

### Vercel (Free)
1. Create account at [vercel.com](https://vercel.com)
2. `npx vercel` in this directory
3. Done! You'll get a URL like `beam.vercel.app`

### GitHub Pages (Free)
1. Push to GitHub repo
2. Settings → Pages → Source: main branch
3. Site at `username.github.io/repo-name`

## Email Capture Setup

Currently uses placeholder JavaScript. To actually capture emails:

### Option 1: Formspree (Easiest - Free tier)
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```
1. Create account at [formspree.io](https://formspree.io)
2. Create form, get your form ID
3. Replace the form action

### Option 2: ConvertKit / Mailchimp
1. Create account
2. Get form embed code
3. Replace the form HTML

### Option 3: Custom Backend
Build your own API endpoint to store emails. More work but full control.

## Recommended Domains

Check availability:
- `beamquotes.com`
- `beamhq.com`
- `getbeam.app`
- `beamapp.io`
- `usebeam.co`

If those are taken, try:
- `beamquotes.io`
- `beamcontractor.com`
- `beam-quotes.com`

## Next Steps

1. ✅ Landing page built
2. ⬜ Choose domain
3. ⬜ Deploy to Netlify/Vercel
4. ⬜ Wire up email capture (Formspree)
5. ⬜ Post in contractor communities
6. ⬜ Collect 30+ signups
7. ⬜ Build MVP if validation succeeds

## Contractor Communities to Post In

### Facebook Groups
- "UK Contractors"
- "Plumbers UK"
- "Electricians UK"
- "Handyman Services UK"
- "Construction UK"

### Reddit
- r/ContractorUK
- r/Plumbing
- r/electricians
- r/Handyman

### Discord/Forums
- Contractor Talk UK
- JLC Online Forums

## Messaging Tips

When posting:
- Lead with the problem ("Still spending 30 mins on quotes?")
- Be authentic - "I'm a developer building this for contractors"
- Ask for feedback, not sales
- Offer early access discount

Example post:
> "Hey everyone - I'm building a tool to help contractors create professional quotes in under 60 seconds instead of the usual 30+ minutes in Word.
>
> Looking for 20 contractors to try it free and give feedback. You'd get lifetime Pro access ($29/mo value) for helping shape the product.
>
> If that sounds useful, drop your email here: [link]
>
> Cheers!"

---

Built with ❤️ for contractors who hate paperwork.
