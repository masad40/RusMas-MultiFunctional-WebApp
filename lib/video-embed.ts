export type VideoProvider = "youtube" | "vimeo";

function youtubeIdFromUrl(url: string): string | null {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ?? null;
    }

    if (host.endsWith("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) {
        return u.pathname.split("/").filter(Boolean)[1] ?? null;
      }
      if (u.pathname.startsWith("/shorts/")) {
        return u.pathname.split("/").filter(Boolean)[1] ?? null;
      }
      const v = u.searchParams.get("v");
      if (v) return v;
      if (u.pathname.startsWith("/live/")) {
        return u.pathname.split("/").filter(Boolean)[1] ?? null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

function vimeoIdFromUrl(url: string): string | null {
  try {
    const u = new URL(url.trim());
    if (!u.hostname.endsWith("vimeo.com")) return null;

    const parts = u.pathname.split("/").filter(Boolean);

    const playerIdx = parts.indexOf("video");
    if (playerIdx >= 0 && parts[playerIdx + 1]) return parts[playerIdx + 1] ?? null;

    const candidate = parts.at(-1);
    if (!candidate || !/^\d+$/.test(candidate)) return null;

    return candidate;
  } catch {
    return null;
  }
}

export function getVideoProvider(url: string): VideoProvider | null {
  const y = youtubeIdFromUrl(url);
  if (y) return "youtube";
  const v = vimeoIdFromUrl(url);
  if (v) return "vimeo";
  return null;
}

/**
 * Builds a privacy-enhanced iframe src for supported watch URLs.
 */
export function getEmbedSrc(url: string): string | null {
  const y = youtubeIdFromUrl(url);
  if (y) {
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
    });
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(y)}?${params.toString()}`;
  }

  const v = vimeoIdFromUrl(url);
  if (v) {
    return `https://player.vimeo.com/video/${encodeURIComponent(v)}`;
  }

  return null;
}
