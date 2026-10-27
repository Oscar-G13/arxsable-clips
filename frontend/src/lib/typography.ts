/**
 * User-provided and generated titles can contain long filenames, URLs, or
 * descenders that the display face does not render safely in tight boxes.
 * These variants deliberately keep wrapping, single-line truncation, and
 * multi-line clamping separate: mixing `truncate` into the wrapping variant
 * makes its emergency word break ineffective, while padding a clamped title
 * can expose part of an extra line in WebKit.
 *
 * Pass these after text-size utilities to `cn()` so their explicit line-height
 * wins over Tailwind's bundled font-size line-height.
 */
const CONTENT_TITLE_BASE_CLASS = "min-w-0 max-w-full font-sans leading-[1.25]";

export const SAFE_CONTENT_TITLE_CLASS =
  `${CONTENT_TITLE_BASE_CLASS} pb-[0.08em] [overflow-wrap:anywhere]`;

export const TRUNCATED_CONTENT_TITLE_CLASS =
  `${CONTENT_TITLE_BASE_CLASS} truncate`;

export const CLAMPED_CONTENT_TITLE_CLASS =
  `${CONTENT_TITLE_BASE_CLASS} line-clamp-2 [overflow-wrap:anywhere]`;
