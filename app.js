const RELEASES_API = "https://api.github.com/repos/GabyY-1/PaperTaPeur/releases/latest";

const targets = {
  windows: document.getElementById("downloadWindows"),
  android: document.getElementById("downloadAndroid"),
  linux: document.getElementById("downloadLinux"),
  mac: document.getElementById("downloadMac")
};

function activate(button, asset) {
  if (!button || !asset) return;
  button.href = asset.browser_download_url;
  button.classList.remove("disabled");
  button.classList.add("available");
  button.removeAttribute("aria-disabled");
  button.textContent = "TÉLÉCHARGER";
}

async function loadRelease() {
  const state = document.getElementById("releaseState");
  try {
    const response = await fetch(RELEASES_API, {headers:{"Accept":"application/vnd.github+json"}});
    if (!response.ok) throw new Error("no release");
    const release = await response.json();
    const assets = release.assets || [];

    activate(targets.windows, assets.find(a => /\.exe$/i.test(a.name)));
    activate(targets.android, assets.find(a => /\.apk$/i.test(a.name)));
    activate(targets.linux, assets.find(a => /\.AppImage$/i.test(a.name)));
    activate(targets.mac, assets.find(a => /\.dmg$/i.test(a.name)));

    state.textContent = release.tag_name ? "Dernière version : " + release.tag_name : "Dernière version disponible";
  } catch {
    state.textContent = "Versions natives en préparation";
  }
}
loadRelease();