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
- Compose selection-driven cake previews in a dedicated presentation component: serve the full grid of variant photos from public/cake-variants resolved by filename, and bundle only the curated photographed sets, so opening the builder never loads every variant; prefer refined whole-cake photographs for exact configuration matches to keep decorations physically integrated; tiers and independent flower and berry flags travel with CakeConfig without changing established pricing.
- Keep real registrations and support separate from the simulated commerce state; use authenticated server functions and database-enforced RPC permissions for private mutations and reads.
- Assign new accounts the client role only; elevated access requires an existing administrator, and initial administrator provisioning must be explicitly authorized for a named account.
- Store stock settings per storefront branch and seasonal campaign settings in Cloud with admin-only writes; apply availability to the simulated cart without decrementing real stock because checkout remains demonstrative.
- Keep combo preparation in each cart item and validate it at checkout so fried/frozen choices persist into orders without altering existing prices or delivery fees.

- Outer frosting travels in CakeConfig with a legacy ivory default; white, chocolate and naked are always selectable and the preview always shows one of the corrected photos in public/bolos (exact match via getCakeImage, otherwise the closest photo labelled as illustrative), because the user rejected the old variant photos.
