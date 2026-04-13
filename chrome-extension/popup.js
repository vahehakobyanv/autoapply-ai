const API_BASE = 'https://autoapply-ai-vert.vercel.app';

document.addEventListener('DOMContentLoaded', async () => {
  const token = await getToken();
  if (token) {
    showLoggedIn();
    detectJob();
    loadStats(token);
  }
});

async function getToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['authToken'], (result) => {
      resolve(result.authToken || null);
    });
  });
}

async function showLoggedIn() {
  document.getElementById('status').className = 'status connected';
  document.getElementById('status').innerHTML = '<span class="dot"></span>Connected to AutoApply AI';
  document.getElementById('btn-login').classList.add('hidden');
}

async function detectJob() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.url) return;

    const isJobSite = tab.url.includes('hh.ru') || tab.url.includes('staff.am');
    if (!isJobSite) return;

    chrome.tabs.sendMessage(tab.id, { action: 'getJobInfo' }, (response) => {
      if (chrome.runtime.lastError) return;
      if (response?.title) {
        document.getElementById('job-detected').classList.remove('hidden');
        document.getElementById('job-title').textContent = response.title;
        document.getElementById('job-company').textContent = response.company || 'Company';

        if (response.salary) {
          const salaryEl = document.getElementById('job-salary');
          salaryEl.textContent = response.salary;
          salaryEl.classList.remove('hidden');
        }

        document.getElementById('btn-save').classList.remove('hidden');
        document.getElementById('btn-apply').classList.remove('hidden');
      }
    });
  } catch {
    // Tab might not be accessible
  }
}

async function loadStats(token) {
  try {
    const res = await fetch(`${API_BASE}/api/extension`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ action: 'get_stats' }),
    });
    const data = await res.json();
    if (!data.error) {
      document.getElementById('stats').classList.remove('hidden');
      document.getElementById('stat-apps').textContent = data.applied || 0;
      document.getElementById('stat-saved').textContent = data.saved || 0;
      document.getElementById('stat-interviews').textContent = data.interviews || 0;
    }
  } catch {}
}

async function saveJob() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const btn = document.getElementById('btn-save');
  btn.textContent = 'Saving...';
  btn.disabled = true;

  try {
    const token = await getToken();
    let jobInfo = {};
    try {
      jobInfo = await new Promise((resolve) => {
        chrome.tabs.sendMessage(tab.id, { action: 'getJobInfo' }, (response) => {
          resolve(response || {});
        });
      });
    } catch {}

    const res = await fetch(`${API_BASE}/api/extension`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ action: 'save_job', url: tab.url, title: jobInfo.title, company: jobInfo.company, salary: jobInfo.salary }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    btn.innerHTML = '&#10003; Saved!';
    btn.style.background = '#16a34a';
    btn.style.color = 'white';
  } catch {
    btn.textContent = 'Failed - Try Again';
    btn.disabled = false;
  }
}

async function quickApply() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const btn = document.getElementById('btn-apply');
  btn.textContent = 'Applying with AI...';
  btn.disabled = true;

  try {
    const token = await getToken();
    const res = await fetch(`${API_BASE}/api/extension`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ action: 'quick_apply', url: tab.url }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    btn.innerHTML = '&#10003; Applied!';
    btn.style.background = '#16a34a';
    btn.style.color = 'white';
    const statsToken = await getToken();
    loadStats(statsToken);
  } catch {
    btn.textContent = 'Failed - Try Again';
    btn.disabled = false;
  }
}
