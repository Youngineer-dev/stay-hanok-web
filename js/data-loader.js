window.siteData = null;

window.dataLoadPromise = fetch('data.json?v=' + new Date().getTime()) // 캐시 방지 파라미터 추가
  .then(response => {
    if (!response.ok) {
      console.error("Critical: Could not load data.json. Status:", response.status);
      throw new Error("Failed to load data.json (HTTP " + response.status + ")");
    }
    return response.json();
  })
  .then(data => {
    console.log("Success: data.json loaded perfectly.");
    window.siteData = data;
  })
  .catch(error => {
    console.error("Critical Error loading JSON data:", error);
    alert("데이터를 불러오지 못했습니다. 서버 상태나 파일 대소문자를 확인하세요.");
  });

window.applyDataToDOM = function(root = document) {
  if (!window.siteData) return;
  
  const pageId = document.body.getAttribute('data-page') || 'index';
  const pageData = window.siteData[pageId] || {};
  const commonData = window.siteData.common || {};
  
  // Helper: Deep value retrieval supporting dot and bracket notation 
  // e.g., "index.hero[0].title" => window.siteData.index.hero[0].title
  const getValue = (path) => {
    return path.split(/[\.\[\]\'\"]/)
      .filter(p => p)
      .reduce((obj, key) => obj ? obj[key] : undefined, window.siteData);
  };

  root.querySelectorAll('[data-text]').forEach(el => {
    const val = getValue(el.getAttribute('data-text'));
    if (val !== undefined) el.innerHTML = val;
  });

  root.querySelectorAll('[data-img]').forEach(el => {
    const val = getValue(el.getAttribute('data-img'));
    if (val !== undefined) el.src = val;
  });

  root.querySelectorAll('[data-link]').forEach(el => {
    const val = getValue(el.getAttribute('data-link'));
    if (val !== undefined) el.href = val;
  });

  // Only update title/meta if we are processing the whole document
  if (root === document) {
    if (pageData.title) document.title = pageData.title;
    
    if (commonData.ogTitle) {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.content = commonData.ogTitle;
    }
    
    if (commonData.ogImage) {
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) ogImage.content = commonData.ogImage;
    }
  }
};

// Once data is successfully loaded, apply to the main document
window.dataLoadPromise.then(() => {
  window.applyDataToDOM();
});
