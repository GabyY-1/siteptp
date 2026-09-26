const GAME_URL = "https://gabyy-1.github.io/PaperTaPeur/";
const RELEASES_API = "https://api.github.com/repos/GabyY-1/PaperTaPeur/releases/latest";

const targets = {
  windows: document.getElementById("downloadWindows"),
  android: document.getElementById("downloadAndroid"),
  linux: document.getElementById("downloadLinux"),
  mac: document.getElementById("downloadMac")
};

function findAsset(assets, matcher) {
  return assets.find(asset => matcher.test(asset.name));
}

function activateDownload(button, asset, label = "TÉLÉCHARGER →") {
  if (!button || !asset) return;
  button.href = asset.browser_download_url;
  button.classList.remove("disabled");
  button.classList.add("active");
  button.removeAttribute("aria-disabled");
  button.textContent = label;
  const status = button.closest(".platform-card")?.querySelector(".availability");
  if (status) {
    status.className = "availability ready";
    status.innerHTML = "<i></i> DISPONIBLE";
  }
}

async function loadRelease() {
  const state = document.getElementById("releaseState");
  try {
    const response = await fetch(RELEASES_API, {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error("No release");

    const release = await response.json();
    const assets = release.assets || [];

    activateDownload(targets.windows, findAsset(assets, /\.exe$/i));
    activateDownload(targets.android, findAsset(assets, /\.apk$/i));
    activateDownload(targets.linux, findAsset(assets, /\.AppImage$/i));
    activateDownload(targets.mac, findAsset(assets, /\.dmg$/i));

    state.classList.add("ready");
    state.innerHTML = "<i></i> " + (release.tag_name ? "DERNIÈRE VERSION · " + release.tag_name : "RELEASE DISPONIBLE");

    applyRecommendation(assets);
  } catch {
    state.innerHTML = "<i></i> VERSION WEB DISPONIBLE";
    applyRecommendation([]);
  }
}

function detectPlatform() {
  const ua = navigator.userAgent || "";
  const platform = navigator.userAgentData?.platform || navigator.platform || "";

  if (/Android/i.test(ua)) return "android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Win/i.test(platform) || /Windows/i.test(ua)) return "windows";
  if (/Mac/i.test(platform) || /Macintosh/i.test(ua)) return "mac";
  if (/Linux/i.test(platform) || /Linux/i.test(ua)) return "linux";
  return "web";
}

function applyRecommendation(assets) {
  const platform = detectPlatform();
  const icon = document.getElementById("recommendedIcon");
  const label = document.getElementById("recommendedLabel");
  const title = document.getElementById("recommendedTitle");
  const text = document.getElementById("recommendedText");
  const button = document.getElementById("recommendedButton");

  const assetsByPlatform = {
    windows: findAsset(assets, /\.exe$/i),
    android: findAsset(assets, /\.apk$/i),
    linux: findAsset(assets, /\.AppImage$/i),
    mac: findAsset(assets, /\.dmg$/i)
  };

  const nativeAsset = assetsByPlatform[platform];

  if (nativeAsset && platform !== "android") {
    const labels = { windows: "WINDOWS", linux: "LINUX", mac: "MACOS" };
    const icons = { windows: "▦", linux: "⌘", mac: "●" };
    icon.textContent = icons[platform] || "◎";
    label.textContent = labels[platform] || "ORDINATEUR";
    title.textContent = "Télécharger PaperTaPeur";
    text.textContent = "Une version installable est disponible pour ton appareil.";
    button.href = nativeAsset.browser_download_url;
    button.textContent = "TÉLÉCHARGER →";
    return;
  }

  if (platform === "android" || platform === "ios") {
    icon.textContent = platform === "android" ? "◆" : "◇";
    label.textContent = "TÉLÉPHONE";
    title.textContent = "Version mobile en préparation";
    text.textContent = "La version téléphone sera développée séparément. La version actuelle est optimisée pour ordinateur.";
    button.href = "#versions";
    button.textContent = "VOIR LES VERSIONS →";
    return;
  }

  icon.textContent = "◎";
  label.textContent = "NAVIGATEUR · PC";
  title.textContent = "Jouer dans le navigateur";
  text.textContent = "Aucun téléchargement nécessaire. Lance PaperTaPeur immédiatement sur ton ordinateur.";
  button.href = GAME_URL;
  button.textContent = "JOUER →";
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(item => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  items.forEach(item => observer.observe(item));
}

function setupFaq() {
  document.querySelectorAll(".faq-list details").forEach(detail => {
    detail.addEventListener("toggle", () => {
      if (!detail.open) return;
      document.querySelectorAll(".faq-list details").forEach(other => {
        if (other !== detail) other.open = false;
      });
    });
  });
}

setupReveal();
setupFaq();
loadRelease();
