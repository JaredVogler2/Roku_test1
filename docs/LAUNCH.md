# Roku launch checklist — SofaSpark Party

Read alongside Roku's live documentation. This project **does not** automatically publish or change your developer account settings.

## 1. Dashboard preparation

1. Open your existing Roku Developer Dashboard and select the public SDK app you created (currently shown as **Test** in the screenshot; Channel ID **893438**). Use this app only if it is the correct property for SofaSpark Party.
2. Update the store-facing name to **SofaSpark Party**, subject to availability and a brand/trademark check.
3. Enroll in Roku **Partner Payouts** and complete all required publisher/payout/tax steps.
4. In app monetization, select **Customers will pay before installing my app (pay-to-install)**. Suggested tier **3** for **$2.99 USD** if currently available. You do not need to create a recurring subscription SKU for this model.
5. Do **not** add web payment URLs, redirect users to purchase outside Roku, or claim the app has an in-app Roku Pay upgrade flow. App purchase is handled at installation through Roku.
6. Set audience/category to **Games** and complete the supported regions, content disclosures, and rights attestations.

**No Roku username/password/payment credentials or beta access codes belong in the GitHub repository.**

## 2. Create assets and package

Run the GitHub Actions **Build and verify Roku sideload package** workflow or execute:

```sh
python -m pip install 'Pillow>=10,<13'
python tools/build.py
python tools/check.py
```

Upload `dist/SofaSpark-Party-Roku.zip` using the Roku developer web installer on your local test device. On the dashboard upload flow, Roku may require a signed/encrypted package generated from a Roku device instead of this *sideload source ZIP*. Follow the current Roku packaging process to package and upload the proper build.

Use `images/store-poster.png` for the store artwork. Capture **actual screenshots** from the running app. Do not submit fake screenshots or screenshots of the website.

## 3. Test on Roku devices

- [ ] Launch app on at least a lower-powered Roku and one Roku TV/player with the current Roku OS.
- [ ] Check 16:9 overscan, card spacing, contrast, and prompt wrapping.
- [ ] Test remote Left/Right/Up/Down/OK, Back, Play, Replay at every screen.
- [ ] Verify Back from game returns to packs, from packs returns to home, from home exits Roku app.
- [ ] Confirm charades 60s, debate 45s, speed 5s, story 75s countdowns.
- [ ] Confirm timer pause/resume, TIME UP, reset and no unintended auto-advance.
- [ ] Confirm Team Sun/Moon scoring and session resets.
- [ ] Confirm 36 distinct cards per pack, shuffled without repeats until deck exhausted.
- [ ] Force close and reopen; confirm no crashes and permanent local registry round counter.
- [ ] Verify offline gameplay after installation (disable internet).
- [ ] Read BrightScript debug console (Roku port 8085) for compiler/runtime errors.
- [ ] Run Roku **Static Analysis**, App Behavior Analysis if applicable, and all pre-cert tests.
- [ ] Confirm app launch beacon, navigation responsiveness, app size, supported resolutions.

**The above are tests to perform, not tests claimed as completed.** GitHub CI performs static content/XML/image/archive checks, **not** a Roku interpreter compile or real-device certification.

## 4. Streaming Store metadata

- App poster: generated 540×405 image
- Screens: capture actual gameplay from Roku device
- Text: see `STORE_LISTING.md`
- Provide real **developer name, customer support URL/email/phone, and admin/technical contacts**.
- Host `PRIVACY.md` contents at a stable HTTPS privacy policy URL, if required by store form.
- Review current compliance, accessibility, and intellectual-property rights.
- Configure availability and pay-to-install price in every market.

## 5. Submit and measure

1. Package using Roku's developer tools, then upload the signed package to Developer Dashboard.
2. Run Static Analysis and any other relevant certification tests.
3. Schedule publication **only after tests pass**; the listing remains unpublished until Roku completes its review.
4. Track store impressions, click-through, paid installs, refunds, reviews, and launch quality in the Dashboard.
5. Build the second release based on observed sales and feedback, not guessed demand.

## Roku documentation

- https://developer.roku.com/dev/docs/channel-publishing-guide
- https://developer.roku.com/dev/docs/monetization-in-developer-dashboard
- https://developer.roku.com/dev/docs/certification
- https://developer.roku.com/dev/docs/developer-setup
- https://developer.roku.com/dev/docs/measuring-channel-performance
