# Editing website content in Storyblok

Maya is the space Owner. Other users with editing access to the space can use the same fields. Content is read at request time: Save and Publish in Storyblok; normal copy updates do not require a website deployment.

| Website area | Storyblok location |
| --- | --- |
| Support copy, donation button, optional replacement image | Support → Sections → Support Content |
| Our Story opening line and milestones | Our Story → Sections → Rich Content |
| Our Story visual timeline | Our Story → Sections → Story Timeline → Milestones |
| Contact details and optional replacement background | Contact → Sections → Rich Content |
| Gallery photo credits | Gallery → Sections → Rich Content |
| Directors board list | Directors → Body → Directors → Board |
| Ensemble introduction | Ensemble → Body → Ensemble → Introduction |
| Shared footer, credits, navigation and newsletter | Footer |
| Navigation and shared social links, including footer icons | Global → navbar |
| Homepage donation button | Global → home_hero_main_text |
| Homepage event heading, link label and empty state | Global → home_events |
| Homepage testimonial heading | Global → home_testimonials |
| Instagram heading and fallback copy/link | Global → instagram-feed |
| Events time notice and past-events heading | Global → events |
| Wall of Love introduction and column labels | Global → testimonials |
| Mission and Vision labels | Global → vision |

The Footer story's Copyright field contains the owner/credits wording. The website adds the copyright symbol and current year automatically; do not include a year in that field. The newsletter settings are shared between the footer and Contact page.

The existing family photo on Support, Contact background and footer artwork remain the defaults when no replacement image is selected. Existing event records, dancer biographies, class content, gallery albums and navigation were already in Storyblok and remain there.

Terms of Service and Privacy Policy remain file-based policy pages. Standard form controls, integration credentials, media behavior and decorative layout stay in code. The Section renderer now uses its existing Storyblok text field rather than a hardcoded example.

## Migration validation

The migration was compared with the live website at 1280 × 900 and 390 × 844. Visible text and link destinations were compared on 15 routes, including the policy pages. The copyright year was the only intentional display-copy difference. Our Story's timeline width and list spacing were adjusted to retain the existing layout.

Local Contact screenshots can show a domain-specific reCAPTCHA error on localhost. The ContactForm component, submission endpoint and key configuration were not changed; no form messages were sent during verification. Dynamic video frames, third-party widgets and image loading are not suitable for exact pixel equality.

New editorial field contracts live in `src/lib/site-content.ts`, alongside the existing generated types. The legacy CLI schema snapshot can be refreshed with `npm run sb-sync` after correcting that command's old absolute paths and signing the CLI into the space.
