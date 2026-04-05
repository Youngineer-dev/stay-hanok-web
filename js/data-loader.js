window.siteData = null;

window.dataLoadPromise = fetch('data.json')
  .then(response => {
    if (!response.ok) throw new Error("Failed to load data.json");
    return response.json();
  })
  .then(data => {
    window.siteData = data;
  })
  .catch(error => {
    console.error("Error loading JSON data:", error);
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
