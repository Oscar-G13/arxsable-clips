# Changelog

What changed in Arx Clips for people using the product. Newest dates are first.

Add a line here when a pull request changes something a user can see. Use **New**, **Improved**, **Fixed**, or **Under the hood**, describe the change in plain language, and link the pull request. Skip internal-only work, or fold it into one **Under the hood** line. Do not include customer names, email addresses, user IDs, or anything else private.

## 2026-10-25

- **Fixed:** Deleting a generation no longer restores used video minutes, and every new video has its length verified before minutes are charged. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Fixed:** Upgrading from Pro to Creator takes effect after the upgrade payment succeeds. If that payment is still open or does not go through, you stay on the plan you already paid for. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Fixed:** Downloading a clip in a social format no longer waits on the whole re-encode, so a long export can finish instead of timing out. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Fixed:** Copying an API key, a creator code, or a share link still works when the browser blocks the clipboard. If it cannot copy, the text is selected and a message tells you to copy it yourself. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Under the hood:** A brief server error no longer clears the YouTube download notice or the What's new list, and those checks are not reported as crashes. ([source](https://github.com/Oscar-G13/arxsable-clips))

## 2026-10-24

- **Fixed:** A YouTube video whose direct audio link is blocked is retried over HLS before a paid download. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **New:** The site is available in Bahasa Indonesia. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Fixed:** Phone videos recorded in portrait no longer fail to render. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Fixed:** Editing a clip keeps a split-screen or stacked layout instead of flattening it back to a single frame. ([source](https://github.com/Oscar-G13/arxsable-clips))

## 2026-10-23

- **Improved:** Uploads can be as large as 4 GB. Video above 1080p or 60 fps is scaled down automatically before clipping. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Improved:** Automatic vertical framing keeps more of the scene around the speaker, instead of cropping in on the face alone. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Improved:** Clip analysis on Claude Sonnet uses the model's structured output, so a long video is more likely to come back with a full set of clips. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Under the hood:** When you submit a video link, a sanitized copy is written to the logs, including when the job is rejected. ([source](https://github.com/Oscar-G13/arxsable-clips))

## 2026-10-22

- **New:** Reaction videos and two people talking over each other can be stacked in the vertical frame. ([source](https://github.com/Oscar-G13/arxsable-clips))

## 2026-10-21

- **New:** Hosted plans are billed by hours of source video. Pro is $9.99/month for 10 hours at 720p, Creator is $24.99/month for 25 hours at 1080p, and yearly billing is two months free. Pro subscribers from before this change keep 1080p. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Improved:** Pricing cards spell out how much video a plan includes, and the price stays inside the card. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **New:** Paste a Twitch or Kick link — a VOD or a clip — and those sources show up alongside YouTube. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Improved:** Calls and talking-head videos are framed more carefully for a vertical crop. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Fixed:** A clip that rewinds to set up the hook stays within 60 seconds, and a long hook title fits on screen. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **New:** The site and app are available in English, Spanish, Portuguese, German, and Chinese. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Under the hood:** YouTube downloads hold up better when several jobs run at once, including through a residential proxy when one is configured. ([source](https://github.com/Oscar-G13/arxsable-clips))

## 2026-10-20

- **Fixed:** After you edit a clip, the caption animation and the hook title from the original render stay in place. ([source](https://github.com/Oscar-G13/arxsable-clips))

## 2026-10-18

- **Fixed:** The editor keeps karaoke captions from the generated clip, including the font, size, and position. ([source](https://github.com/Oscar-G13/arxsable-clips))

## 2026-10-17

- **Under the hood:** YouTube downloads go through yt-dlp or Apify. ([source](https://github.com/Oscar-G13/arxsable-clips))

## 2026-10-16

- **New:** Connect YouTube, TikTok, or Instagram to publish a clip and see how those posts perform. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Improved:** The library groups each generation with its original video, and an uploaded file keeps its filename. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **New:** A self-hosted install can use its own YouTube download service. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Under the hood:** If the first YouTube download does not check out, Arx Clips can try another one within the same limit. ([source](https://github.com/Oscar-G13/arxsable-clips))

## 2026-10-15

- **Under the hood:** Clips and uploads are stored durably and removed when you delete them. ([source](https://github.com/Oscar-G13/arxsable-clips))

## 2026-10-14

- **Improved:** The generation page shows while a video is still importing, then clears that note once it is ready. ([source](https://github.com/Oscar-G13/arxsable-clips))

## 2026-10-13

- **New:** A public status page shows whether Arx Clips is up. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Fixed:** Closing a video stops the transfer instead of leaving it running. ([source](https://github.com/Oscar-G13/arxsable-clips))

## 2026-10-12

- **Fixed:** Caption templates use the real TikTok Sans Bold and THEBOLDFONT, and oversized caption styles are smaller. ([source](https://github.com/Oscar-G13/arxsable-clips))

## 2026-10-11

- **New:** Clips open on a short hook, then cut to the sentence where the moment actually starts. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Improved:** Long pauses are tightened so a clip keeps moving. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Improved:** On a wide shot with several people, the crop follows whoever is speaking. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Improved:** A long video is reviewed in sections, then the best moments are ranked together. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Fixed:** Face tracking works again, so a vertical crop can stay on the person. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Improved:** Upscaled vertical crops look sharper. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Improved:** Each video produces at most 10 clips. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **New:** The home page and the demo play a new set of podcast clips. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **New:** Checkout accepts a creator promo code. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **New:** The app can show an announcement from the Arx Clips team. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Improved:** The home page includes the Product Hunt badge. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Fixed:** If every clip fails to render, the job is marked failed instead of looking finished. A job that never starts does not use your monthly video allowance. ([source](https://github.com/Oscar-G13/arxsable-clips))

## 2026-10-10

- **New:** The creator program is open. Apply, share your code, and your audience gets 20% off for 3 months. Approved creators get Pro. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Improved:** Pricing explains that self-hosting is free, next to the hosted plans. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Improved:** Affiliate is linked from the top of the site and the footer. ([source](https://github.com/Oscar-G13/arxsable-clips))

## 2026-10-06

- **Improved:** Captions detect the spoken language, stay lined up with the audio, and use fonts that cover more languages. ([source](https://github.com/Oscar-G13/arxsable-clips))

## 2026-10-05

- **New:** A demo page and practical guides cover clipping, self-hosting, and how Arx Clips compares with other tools. ([source](https://github.com/Oscar-G13/arxsable-clips))

## 2026-10-04

- **Improved:** Upgrade prompts explain what the next plan adds, and you can move from Pro to Creator without starting a new subscription. ([source](https://github.com/Oscar-G13/arxsable-clips))

## 2026-10-03

- **New:** You can delete your account from Settings. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **New:** If you forget your password, you can reset it by email. ([source](https://github.com/Oscar-G13/arxsable-clips))

## 2026-10-02

- **Fixed:** A transcription that stalls gives up instead of waiting forever, and the app can tell when the worker is down. ([source](https://github.com/Oscar-G13/arxsable-clips))
- **Under the hood:** Self-hosted installs can build a CPU-only image and keep the sign-in addresses they already use. ([source](https://github.com/Oscar-G13/arxsable-clips))
