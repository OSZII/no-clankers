const states = {
  loading: document.getElementById('state-loading'),
  loggedOut: document.getElementById('state-logged-out'),
  noSub: document.getElementById('state-no-sub'),
  active: document.getElementById('state-active')
};

let debounceTimer = null;

function showState(name) {
  Object.values(states).forEach((el) => el.classList.add('hidden'));
  states[name].classList.remove('hidden');
}

function setUserInfo(prefix, user) {
  const avatar = document.getElementById(`${prefix}-avatar`);
  const name = document.getElementById(`${prefix}-name`);
  if (avatar && user.image) avatar.src = user.image;
  if (name) name.textContent = user.name || user.email || 'User';
}

async function init() {
  showState('loading');

  chrome.runtime.sendMessage({ type: 'GET_AUTH_STATE' }, (response) => {
    if (!response || !response.authenticated) {
      showState('loggedOut');
      return;
    }

    if (!response.subscription?.active) {
      setUserInfo('nosub', response.user);
      showState('noSub');
      return;
    }

    setUserInfo('active', response.user);
    document.getElementById('threshold-slider').value = response.threshold;
    document.getElementById('threshold-value').textContent = response.threshold;
    showState('active');
  });
}

// Login button
document.getElementById('btn-login').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'LOGIN' });
  window.close();
});

// Logout buttons
document.getElementById('btn-logout').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'LOGOUT' }, () => {
    showState('loggedOut');
  });
});
document.getElementById('btn-logout-nosub').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'LOGOUT' }, () => {
    showState('loggedOut');
  });
});

// Threshold slider
document.getElementById('threshold-slider').addEventListener('input', (e) => {
  const value = parseInt(e.target.value, 10);
  document.getElementById('threshold-value').textContent = value;

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    chrome.runtime.sendMessage({ type: 'SET_THRESHOLD', value });
  }, 300);
});

// React to storage changes (e.g. auth state updated by service worker)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && (changes.token || changes.user || changes.subscription)) {
    init();
  }
});

// Initialize
init();
