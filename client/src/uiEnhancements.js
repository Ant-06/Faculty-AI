/* FacultyAI Hub smooth scroll letter reveal. Authentication pages are excluded. */
const AUTH_ROUTES = new Set(["/login", "/admin-login", "/register"]);
const SKIP_TAGS = new Set([
  "SCRIPT", "STYLE", "NOSCRIPT", "SVG", "PATH", "INPUT", "TEXTAREA",
  "SELECT", "OPTION", "BUTTON", "HEADER", "NAV", "ASIDE", "FOOTER"
]);
const TEXT_TAGS = new Set(["H1", "H2", "H3", "H4", "H5", "H6", "P", "LI"]);

let revealObserver = null;
let mutationObserver = null;
let scheduled = false;

function isAuthRoute() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  return AUTH_ROUTES.has(path);
}

function isMeaningful(text) {
  return !!text && /[A-Za-z0-9]/.test(text) && text.trim().length > 0;
}

function shouldSkipTextNode(node) {
  let el = node.parentElement;
  while (el) {
    if (SKIP_TAGS.has(el.tagName)) return true;
    if (el.dataset?.letterReveal === "false") return true;
    if (el.classList.contains("letter-reveal-host")) return true;
    if (el.getAttribute("aria-hidden") === "true") return true;
    if (el.closest("pre, code, table, .font-mono")) return true;
    el = el.parentElement;
  }
  return false;
}

function isAnimatableTextNode(node) {
  if (!node || node.nodeType !== Node.TEXT_NODE) return false;
  if (!isMeaningful(node.nodeValue || "")) return false;
  if (shouldSkipTextNode(node)) return false;

  let parent = node.parentElement;
  while (parent && parent.id !== "root") {
    if (TEXT_TAGS.has(parent.tagName)) return true;
    parent = parent.parentElement;
  }
  return false;
}

function ensureObserver() {
  if (revealObserver || typeof IntersectionObserver === "undefined") return;

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("letters-visible");
      revealObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -8% 0px"
  });
}

function observeHost(host) {
  ensureObserver();
  if (!host || host.dataset.letterObserved === "true") return;

  host.dataset.letterObserved = "true";

  if (!revealObserver) {
    host.classList.add("letters-visible");
    return;
  }

  // Content already on screen should animate immediately; below-the-fold
  // content waits for the scroll intersection.
  const rect = host.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  if (rect.top < viewportHeight * 0.92 && rect.bottom > 0) {
    host.classList.add("letters-visible");
    revealObserver.unobserve(host);
  } else {
    revealObserver.observe(host);
  }
}

function animateTextNode(node) {
  if (!isAnimatableTextNode(node) || isAuthRoute()) return;

  const parent = node.parentElement;
  if (!parent || parent.dataset.letterPrepared === "true") return;

  const text = node.nodeValue || "";
  const host = document.createElement("span");
  host.className = "letter-reveal-host";
  host.dataset.letterPrepared = "true";
  host.setAttribute("aria-label", text.trim());

  const fragment = document.createDocumentFragment();
  let index = 0;

  for (const char of text) {
    if (/\s/.test(char)) {
      fragment.appendChild(document.createTextNode(char));
      continue;
    }

    const span = document.createElement("span");
    span.className = "letter-reveal";
    span.style.setProperty("--letter-index", String(Math.min(index, 55)));
    span.textContent = char;
    fragment.appendChild(span);
    index += 1;
  }

  host.appendChild(fragment);
  node.parentNode.replaceChild(host, node);
  observeHost(host);
}

function prepareText() {
  if (isAuthRoute()) return;
  ensureObserver();

  const root = document.getElementById("root");
  if (!root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node;

  while ((node = walker.nextNode())) {
    if (isAnimatableTextNode(node)) nodes.push(node);
  }

  nodes.forEach(animateTextNode);

  root.querySelectorAll(".letter-reveal-host:not([data-letter-observed])")
    .forEach(observeHost);
}

function optimiseUI() {
  document.querySelectorAll("svg.lucide").forEach((icon) => {
    icon.style.flexShrink = "0";
    icon.style.strokeWidth = "1.8";
  });

  document.querySelectorAll("button, a, input, textarea, select").forEach((el) => {
    el.classList.add("ui-control");
  });
}

function scheduleRun() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    optimiseUI();
    if (!isAuthRoute()) prepareText();
  });
}

export function initUIEnhancements() {
  if (window.__facultyAIHubUIEnhancements) return;
  window.__facultyAIHubUIEnhancements = true;

  optimiseUI();
  if (!isAuthRoute()) prepareText();

  const root = document.getElementById("root");
  if (!root) return;

  mutationObserver = new MutationObserver(scheduleRun);
  mutationObserver.observe(root, { childList: true, subtree: true });

  window.addEventListener("popstate", () => setTimeout(scheduleRun, 30));
}
