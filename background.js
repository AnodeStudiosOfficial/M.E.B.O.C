// Temizlenecek veri türleri ve zaman aralığı (0 = Tüm Zamanlar)
const clearOptions = { "since": 0 };
const dataTypesToClear = {
  "appcache": true,
  "cache": true,
  "cacheStorage": true,
  "cookies": true,
  "downloads": true,
  "fileSystems": true,
  "formData": true,
  "history": true,
  "indexedDB": true,
  "localStorage": true,
  "passwords": true,
  "serviceWorkers": true,
  "webSQL": true
};

// Tam Temizlik Fonksiyonu
function executeCleanUp() {
  chrome.browsingData.remove(clearOptions, dataTypesToClear, () => {
    console.log("M.E.B.O.C: Tüm veriler ve geçmiş başarıyla sıfırlandı.");
  });
}

// Tarayıcı ilk açıldığında doğrudan temizle
chrome.runtime.onStartup.addListener(() => {
  executeCleanUp();
});

// Uzantı yüklendiğinde/yenilendiğinde temizle
chrome.runtime.onInstalled.addListener(() => {
  executeCleanUp();
});

// Sekme hareketlerinde ve pencereler kapandığında yedek kontrol
chrome.tabs.onCreated.addListener(() => {
  chrome.storage.local.get(["needsClean"], (result) => {
    if (result.needsClean) {
      executeCleanUp();
      chrome.storage.local.set({ needsClean: false });
    }
  });
});

// Chrome sonlandırılmaya başladığında bayrak koy ve temizlik tetikle
chrome.runtime.onSuspend.addListener(() => {
  chrome.storage.local.set({ needsClean: true });
  executeCleanUp();
});