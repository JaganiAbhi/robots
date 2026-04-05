/**
 * Hash-based SPA routes (same tab, no full page reload).
 * Examples: #/, #/robots, #/robot/titan-x7, #/shop, #/builder, #/faq
 */
export function parseRoute() {
  let path = (location.hash || "#/").replace(/^#/, "").trim() || "/";
  if (!path.startsWith("/")) path = "/" + path;

  const parts = path.split("/").filter(Boolean);

  if (parts.length === 0 || parts[0] === "home") {
    return { name: "home", path: "/" };
  }
  if (parts[0] === "robots" && !parts[1]) {
    return { name: "robots", path: "/robots" };
  }
  if (parts[0] === "robot" && parts[1]) {
    return { name: "detail", id: parts[1], path: `/robot/${parts[1]}` };
  }
  if (parts[0] === "builder") {
    return { name: "builder", path: "/builder" };
  }
  if (parts[0] === "shop") {
    return { name: "shop", path: "/shop" };
  }
  if (parts[0] === "faq") {
    return { name: "faq", path: "/faq" };
  }
  return { name: "home", path: "/" };
}

/** Normalize in-app link href (e.g. "#/robots", "#robots") to router path "/robots". */
export function hrefToNavPath(href) {
  if (!href || href === "#") return "/";
  let raw = href.slice(1);
  if (!raw || raw === "home") return "/";
  if (!raw.startsWith("/")) raw = "/" + raw;
  return raw;
}

export function navTo(path) {
  const p = path.startsWith("#") ? path : "#" + path;
  const normalized = p.startsWith("#/")
    ? p
    : "#" + (p.slice(1).startsWith("/") ? p.slice(1) : "/" + p.slice(1));
  if (location.hash === normalized) {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else {
    location.hash = normalized;
  }
}
