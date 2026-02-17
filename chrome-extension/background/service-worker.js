const API_BASE = 'http://localhost:5173';

// ── External messages (from the callback page) ──
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  if (message.type === 'NO_CLANKERS_AUTH') {
    chrome.storage.local.set({
      token: message.token,
      user: message.user,
      subscription: message.subscription
    }, () => {
      sendResponse({ success: true });
    });
    return true; // async response
  }
});

// ── Internal messages (from popup & content script) ──
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_AUTH_STATE':
      chrome.storage.local.get(['token', 'user', 'subscription', 'threshold'], (data) => {
        sendResponse({
          authenticated: !!data.token,
          token: data.token || null,
          user: data.user || null,
          subscription: data.subscription || { active: false },
          threshold: data.threshold ?? 50
        });
      });
      return true;

    case 'LOGIN':
      chrome.tabs.create({ url: `${API_BASE}/auth/login?redirect=extension` });
      sendResponse({ success: true });
      break;

    case 'LOGOUT':
      chrome.storage.local.remove(['token', 'user', 'subscription'], () => {
        sendResponse({ success: true });
      });
      return true;

    case 'SET_THRESHOLD':
      chrome.storage.local.set({ threshold: message.value }, () => {
        sendResponse({ success: true });
      });
      return true;

    case 'GET_THRESHOLD':
      chrome.storage.local.get(['threshold'], (data) => {
        sendResponse({ threshold: data.threshold ?? 50 });
      });
      return true;

    case 'SCORE_TWEETS':
      scoreTweets(message.texts)
        .then((scores) => sendResponse({ scores }))
        .catch((err) => sendResponse({ error: err.message }));
      return true;

    default:
      sendResponse({ error: 'Unknown message type' });
  }
});

// ── Score tweets via API ──
async function scoreTweets(texts) {
  const data = await chrome.storage.local.get(['token']);
  console.log(data);

  if (!data.token) throw new Error('Not authenticated');

  const res = await fetch(`${API_BASE}/api/ext/score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${data.token}`
    },
    body: JSON.stringify({ texts })
  });

  if (res.status === 401) {
    chrome.storage.local.remove(['token', 'user', 'subscription']);
    throw new Error('Session expired');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  const body = await res.json();
  return body.scores;
}

// ── Refresh session status ──
async function refreshStatus() {
  const data = await chrome.storage.local.get(['token']);
  if (!data.token) return;

  try {
    const res = await fetch(`${API_BASE}/api/ext/status`, {
      headers: { 'Authorization': `Bearer ${data.token}` }
    });

    if (res.status === 401) {
      chrome.storage.local.remove(['token', 'user', 'subscription']);
      return;
    }

    if (res.ok) {
      const body = await res.json();
      chrome.storage.local.set({
        user: body.user,
        subscription: body.subscription
      });
    }
  } catch {
    // Network error — silently ignore, will retry on next alarm
  }
}

// ── Alarms ──
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'statusCheck') {
    refreshStatus();
  }
});

// ── Install/startup ──
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['threshold'], (data) => {
    if (data.threshold === undefined) {
      chrome.storage.local.set({ threshold: 50 });
    }
  });
  chrome.alarms.create('statusCheck', { periodInMinutes: 30 });
});

chrome.runtime.onStartup.addListener(() => {
  refreshStatus();
  chrome.alarms.create('statusCheck', { periodInMinutes: 30 });
});
