<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep bakery demo state in a shared React context with hydration-safe browser persistence because this request is a simulated frontend, not a live commerce service.
- Keep pricing, cake options and cart calculations in a browser-safe domain module so their business rules can be tested independently.
- Use the root route for the shared bakery shell and separate leaf routes for catalog, cake customization, cart and orders so navigation preserves the same customer state.
- Compose selection-driven cake previews from bundled photographic variants in a dedicated presentation component, preferring refined whole-cake photographs for exact configuration matches to keep decorations physically integrated; tiers and independent flower and berry flags travel with CakeConfig without changing established pricing.
- Keep real registrations and support separate from the simulated commerce state; use authenticated server functions and database-enforced RPC permissions for private mutations and reads.
- Assign new accounts the client role only; elevated access requires an existing administrator, and initial administrator provisioning must be explicitly authorized for a named account.

- Outer frosting travels in CakeConfig with a legacy ivory default; enable photographic finishes only for matching configuration assets so the preview and cart never misrepresent a selected exterior.
