export function parseRoute() {
  let path = (location.hash || "#/").replace(/^#/, "") || "/";
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

export function navTo(path) {
  const p = path.startsWith("#") ? path : "#" + path;
  if (location.hash === p) {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else {
    location.hash = path.startsWith("#") ? path : "#" + path;
  }
}
