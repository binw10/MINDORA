# Directory Structure

```text
.github/workflows/
  deploy.yml                         Guarded manual production deployment workflow.

deploy/apache/
  midra.ai.conf                      Reviewed Apache SSL reverse proxy vhost template.

app/
  layout.tsx                         Root layout, provider wiring, header/footer frame.
  page.tsx                           Homepage entry.
  system/page.tsx                    System page entry.
  about/page.tsx                     About page.
  solutions/page.tsx                 Solutions page.
  use-cases/page.tsx                 Use cases page.
  advantages/page.tsx                Advantages page.
  privacy-policy/page.tsx            Privacy policy page.
  cookie-policy/page.tsx             Cookie policy page.
  terms-of-use/page.tsx              Terms page.
  api/contact/route.ts               Contact form API route.

components/layout/
  Header.tsx                         Primary navigation and contact trigger.
  Footer.tsx                         Footer links and legal navigation.
  Container.tsx                      Shared width container.
  LanguageSwitcher.tsx               Locale control.
  SkipLink.tsx                       Keyboard accessibility skip link.

components/system/
  SystemPageContent.tsx              Main system/home page composition.
  HeroSection.tsx                    Hero section.
  SystemDiagram.tsx                  Mind map visual and motion area.
  CTASection.tsx                     Contact CTA area.
  ContactDrawer.tsx                  Contact form drawer.
  systemContent.ts                   Copy/content model for system page.

components/sections/
  ContentPage.tsx                    Shared secondary page layout.
  LegalPage.tsx                      Shared legal page layout.
  sitePagesContent.ts                Content model for secondary pages.

lib/contact/
  validation.ts                      Contact form validation and normalization.
  supabase.ts                        Supabase REST insert logic.

lib/i18n/
  LanguageProvider.tsx               Client-side locale provider.
  dictionary.ts                      Shared dictionary content.
  locales.ts                         Supported locale definitions.

lib/motion/
  gsapMotionSystem.ts                Central GSAP motion helpers.

public/images/
  Static image assets used by pages.

scripts/
  healthcheck.sh                     Local app/proxy health check.
  preflight.sh                       npm ci dry-run, lint, build validation.
  backup-production.sh               Production source backup excluding secrets and build output.
  deploy-local.sh                    Manual server-side deployment helper with rollback.
  audit-production.sh                Lightweight production status report.

docs/
  architecture.md                    System architecture.
  operations.md                      Routine production operations.
  release-guide.md                   Release process.
  disaster-recovery.md               Recovery procedures.
  environment.md                     Environment variable reference.
  github-actions-deployment-guide.md GitHub Actions deployment setup.
```
