# SofaSpark Party (Roku)

**Turn your television into a party game.** SofaSpark Party is a native Roku SDK application built with **SceneGraph XML + BrightScript**. It runs locally with **432 original cards** across 4 modes and 3 audience packs, using only the Roku remote. No account, phone, video hosting, ad SDK, music licenses, or subscription backend.

**Status:** Functional source-code MVP; automated package generation is configured. **Not yet tested on a physical Roku or approved for the Roku Streaming Store.**

## Product

| Game | Gameplay | Timer |
| --- | --- | --- |
| Act It Out | A performer acts out a charades card while teammates guess | 60s |
| Pick A Side | The room debates a fun would-you-rather question | 45s |
| Beat The Clock | Name three things before the timer runs out | 5s |
| Story Spark | Make up a story based on a surprising scenario | 75s |

Every mode has **Family Night, Friends Night, and Date Night** packs, each with 36 original prompts. All packs are included with a **single pay-to-install purchase**. Two team scores are available in every mode if your group wants to compete. The app shuffles each deck and displays every card before repeating.

## Interactive HTML design prototype

**Play now:** https://sofaspark-party-preview.vercel.app

The `web/` folder contains a free, responsive browser version of all **432 original Roku game cards**, with keyboard/remote-style controls, four game modes, three audience packs, scoring, countdown timers and a **Design lab** for experimenting with palette, font size and mobile layout. It can also be installed as a browser app with offline support after the first visit.

See [browser instructions](web/README.md). This is a **design prototype**, and the Roku SceneGraph UI still needs visual updates after design sign-off.

## Build and sideload

### Automated (easiest)

1. Open the [GitHub Actions page](https://github.com/JaredVogler2/Roku_test1/actions).
2. Select **Build and verify Roku sideload package** → **Run workflow** (or use the latest completed `main` workflow).
3. Download the **SofaSpark-Roku-package** artifact, unzip it, and locate `SofaSpark-Party-Roku.zip`. The artifact also includes a **540×405 store poster**.
4. Enable Roku Developer Mode: Home ×3, Up ×2, Right, Left, Right, Left, Right. Record the IP address and set the device development password.
5. In a browser on the same network, visit `http://ROKU_IP`, sign in as `rokudev` with your development password, and upload **the inner `SofaSpark-Party-Roku.zip`** to the Development Application Installer.
6. Play on the actual Roku TV/player and inspect the BrightScript console on port 8085 for errors.

Only one sideloaded app can be installed at once. The 6 artwork assets are generated during packaging and are not checked into Git.

### Local (Python 3.10+)

```sh
python -m pip install 'Pillow>=10,<13'
python tools/build.py
python tools/check.py
```

Output: `dist/SofaSpark-Party-Roku.zip`. The builder creates all required Roku app icons and HD/FHD/SD splash graphics. The packaged archive is checked against Roku's 4 MiB limit.

## Roku remote controls

| Screen | Remote | Action |
| --- | --- | --- |
| Home | Left / Right | Highlight game |
| Home | OK | Choose audience |
| Packs | Left / Right | Highlight pack |
| Packs | OK | Start game |
| Game | OK / Right | Next card |
| Game | Left | Previous card |
| Game | Up | Award 1 point to Team Sun, then next card |
| Game | Down | Award 1 point to Team Moon, then next card |
| Game | Play / Pause | Pause or resume countdown; restart if expired |
| Game | Replay | Restart timer |
| All screens | Back | Previous screen (or exit from home) |

Game scores reset when a new session starts. Lifetime card count is stored locally in the Roku registry. No information is transmitted to a third party.

## Monetization and launch

**Recommended test price: $2.99 one-time, tier 3.** Pay-to-install is a Roku Developer Dashboard setting for public games; **no external payment page or in-app checkout is used**. Pricing, payouts, and tax/identity information are not configured by this code. See [docs/LAUNCH.md](docs/LAUNCH.md) for the exact account-side steps and certification checklist, and [STORE_LISTING.md](STORE_LISTING.md) for copy and screenshots.

**Do not publish before real-device testing, branding/name clearance, accessibility review, and Roku certification.** Store listing art, support details, policies, rights and payout setup remain the developer's responsibility.

## Architecture

```text
manifest                    Roku app metadata, artwork URIs
source/main.brs             roSGScreen lifecycle
source/decks.brs            All 432 original prompt cards
components/MainScene.xml    1080p native Roku user interface
components/MainScene.brs    App navigation, scores, timers, shuffle, registry
tools/build.py              Original artwork generation and Roku ZIP
tools/check.py              Package and content validation
.github/workflows/package.yml  CI-build downloadable artifact
STORE_LISTING.md            Product marketing copy
docs/LAUNCH.md              Dashboard setup and QA
PRIVACY.md                  Simple privacy policy
```

### Official SDK documentation consulted (November 15, 2026)

- [Roku development overview](https://developer.roku.com/dev/docs/first-steps)
- [App manifest requirements](https://developer.roku.com/dev/docs/channel-manifest)
- [SceneGraph Label](https://developer.roku.com/dev/docs/label)
- [SceneGraph Timer](https://developer.roku.com/dev/docs/timer)
- [Remote events](https://developer.roku.com/dev/docs/handling-application-events)
- [Measuring app launch performance](https://developer.roku.com/dev/docs/measuring-channel-performance)
- [Pay-to-install monetization](https://developer.roku.com/dev/docs/monetization-in-developer-dashboard)
- [App publishing](https://developer.roku.com/dev/docs/channel-publishing-guide)
- [Certification criteria](https://developer.roku.com/dev/docs/certification)

Copyright (c) 2026. Original source and content; distribution licensing to be determined by the repository owner.
