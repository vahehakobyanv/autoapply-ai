// Content script - runs on hh.ru and staff.am pages

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getJobInfo') {
    sendResponse(extractJobInfo());
  }
  if (request.action === 'getPageHTML') {
    sendResponse({ html: document.body.innerText.slice(0, 5000) });
  }
  return true;
});

function extractJobInfo() {
  const url = window.location.href;

  // hh.ru
  if (url.includes('hh.ru')) {
    const title = document.querySelector('[data-qa="vacancy-title"]')?.textContent?.trim()
      || document.querySelector('h1')?.textContent?.trim() || '';
    const company = document.querySelector('[data-qa="vacancy-company-name"]')?.textContent?.trim()
      || document.querySelector('.vacancy-company-name')?.textContent?.trim() || '';
    const salary = document.querySelector('[data-qa="vacancy-salary"]')?.textContent?.trim() || '';
    const location = document.querySelector('[data-qa="vacancy-view-location"]')?.textContent?.trim() || '';
    return { title, company, salary, location, url, source: 'hh.ru' };
  }

  // staff.am
  if (url.includes('staff.am')) {
    const title = document.querySelector('.job-title, h1.title')?.textContent?.trim() || '';
    const company = document.querySelector('.company-name, .employer-name')?.textContent?.trim() || '';
    return { title, company, url, source: 'staff.am' };
  }

  return { title: document.title, url, source: 'unknown' };
}

function getStoredToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['authToken'], (result) => {
      resolve(result.authToken || null);
    });
  });
}

// Inject buttons on job pages
function injectApplyButton() {
  if (document.getElementById('autoapply-container')) return;

  const url = window.location.href;
  let target = null;

  if (url.includes('hh.ru') && url.includes('/vacancy/')) {
    target = document.querySelector('[data-qa="vacancy-response-link-top"]')?.parentElement;
  } else if (url.includes('staff.am') && url.includes('/jobs/')) {
    target = document.querySelector('.apply-btn, .job-apply-btn')?.parentElement;
  }

  if (target) {
    const container = document.createElement('div');
    container.id = 'autoapply-container';

    // Save button
    const saveBtn = document.createElement('button');
    saveBtn.id = 'autoapply-save-btn';
    saveBtn.innerHTML = '&#128278; Save Job';
    saveBtn.className = 'autoapply-inject-btn autoapply-save';
    saveBtn.onclick = async (e) => {
      e.preventDefault();
      saveBtn.textContent = 'Saving...';
      saveBtn.disabled = true;
      try {
        const token = await getStoredToken();
        if (!token) { window.open('https://autoapply-ai-vert.vercel.app/login', '_blank'); return; }
        const info = extractJobInfo();
        const res = await fetch('https://autoapply-ai-vert.vercel.app/api/extension', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ action: 'save_job', ...info }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        saveBtn.innerHTML = '&#10003; Saved!';
        saveBtn.className = 'autoapply-inject-btn autoapply-saved';
      } catch {
        saveBtn.textContent = 'Failed';
        saveBtn.disabled = false;
      }
    };

    // Quick Apply button
    const applyBtn = document.createElement('button');
    applyBtn.id = 'autoapply-btn';
    applyBtn.innerHTML = '&#9889; Quick Apply with AI';
    applyBtn.className = 'autoapply-inject-btn autoapply-apply';
    applyBtn.onclick = async (e) => {
      e.preventDefault();
      applyBtn.textContent = 'Applying...';
      applyBtn.disabled = true;
      try {
        const token = await getStoredToken();
        if (!token) { window.open('https://autoapply-ai-vert.vercel.app/login', '_blank'); return; }
        const res = await fetch('https://autoapply-ai-vert.vercel.app/api/extension', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ action: 'quick_apply', url }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        applyBtn.innerHTML = '&#10003; Applied!';
        applyBtn.className = 'autoapply-inject-btn autoapply-saved';
      } catch {
        applyBtn.textContent = 'Failed - Try Again';
        applyBtn.disabled = false;
      }
    };

    container.appendChild(saveBtn);
    container.appendChild(applyBtn);
    target.appendChild(container);
  }
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectApplyButton);
} else {
  injectApplyButton();
}

// Watch for SPA navigation
const observer = new MutationObserver(() => {
  setTimeout(injectApplyButton, 500);
});
observer.observe(document.body, { childList: true, subtree: true });
