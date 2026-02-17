(() => {
  const BATCH_DELAY = 500;
  const MAX_BATCH = 25;
  const SCORE_ATTR = 'data-nc-score';
  const PROCESSED_ATTR = 'data-nc-processed';

  let pendingTexts = [];
  let pendingArticles = [];
  let batchTimer = null;
  let currentThreshold = 50;
  let sessionStats = { scanned: 0, muted: 0 };

  // Load threshold from storage
  chrome.storage.local.get(['threshold'], (data) => {
    currentThreshold = data.threshold ?? 50;
  });

  // Listen for threshold changes — re-apply without re-fetching scores
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.threshold) {
      currentThreshold = changes.threshold.newValue ?? 50;
      reapplyThreshold();
    }
  });

  // Forward auth messages from the callback page to service worker
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (event.data?.type === 'NO_CLANKERS_AUTH') {
      chrome.runtime.sendMessage(event.data);
    }
  });

  function reapplyThreshold() {
    const scored = document.querySelectorAll(`[${SCORE_ATTR}]`);
    scored.forEach((article) => {
      const score = parseInt(article.getAttribute(SCORE_ATTR), 10);
      applyMuting(article, score);
    });
  }

  function applyMuting(article, score) {
    if (score >= currentThreshold) {
      article.style.opacity = '0.1';
      article.style.filter = 'blur(4px)';
      article.style.transition = 'opacity 0.3s, filter 0.3s';
      if (!article.dataset.ncMuted) {
        article.dataset.ncMuted = '1';
        sessionStats.muted++;
      }
    } else {
      article.style.opacity = '';
      article.style.filter = '';
      article.style.transition = 'opacity 0.3s, filter 0.3s';
      if (article.dataset.ncMuted) {
        delete article.dataset.ncMuted;
        sessionStats.muted--;
      }
    }
  }

  function injectBadge(article, score) {
    // Don't add duplicate badges
    if (article.querySelector('.nc-badge')) return;

    const badge = document.createElement('div');
    badge.className = 'nc-badge';
    badge.textContent = `${score}% AI`;

    let bgColor, textColor;
    if (score < 50) {
      bgColor = '#16a34a'; // green
      textColor = '#fff';
    } else if (score < 80) {
      bgColor = '#d97706'; // amber
      textColor = '#fff';
    } else {
      bgColor = '#dc2626'; // red
      textColor = '#fff';
    }

    Object.assign(badge.style, {
      position: 'absolute',
      top: '4px',
      right: '4px',
      background: bgColor,
      color: textColor,
      fontSize: '11px',
      fontWeight: '700',
      padding: '2px 6px',
      borderRadius: '4px',
      zIndex: '10',
      pointerEvents: 'none',
      fontFamily: 'system-ui, sans-serif'
    });

    // Ensure article is positioned for absolute badge
    const pos = getComputedStyle(article).position;
    if (pos === 'static') {
      article.style.position = 'relative';
    }

    article.appendChild(badge);
  }

  function processBatch() {
    batchTimer = null;
    if (pendingTexts.length === 0) return;

    const texts = pendingTexts.splice(0, MAX_BATCH);
    const articles = pendingArticles.splice(0, MAX_BATCH);

    chrome.runtime.sendMessage({ type: 'SCORE_TWEETS', texts }, (response) => {
      if (!response || response.error) {
        console.warn('[No Clankers] Score error:', response?.error || 'No response');
        return;
      }

      response.scores.forEach((score, i) => {
        if (score === null || score === undefined) return;
        const article = articles[i];
        if (!article) return;

        article.setAttribute(SCORE_ATTR, score);
        sessionStats.scanned++;

        injectBadge(article, score);
        applyMuting(article, score);
      });
    });

    // If more tweets are still pending, schedule another batch
    if (pendingTexts.length > 0) {
      batchTimer = setTimeout(processBatch, BATCH_DELAY);
    }
  }

  function queueTweet(article, text) {
    pendingTexts.push(text);
    pendingArticles.push(article);

    if (!batchTimer) {
      batchTimer = setTimeout(processBatch, BATCH_DELAY);
    }
  }

  function scanForTweets() {
    const tweetTexts = document.querySelectorAll('[data-testid="tweetText"]');

    tweetTexts.forEach((tweetTextEl) => {
      const article = tweetTextEl.closest('article[data-testid="tweet"]');
      if (!article) return;
      if (article.hasAttribute(PROCESSED_ATTR)) return;

      article.setAttribute(PROCESSED_ATTR, '1');
      const text = tweetTextEl.innerText?.trim();
      if (!text) return;

      queueTweet(article, text);
    });
  }

  // Observe DOM for dynamically loaded tweets
  const observer = new MutationObserver(() => {
    scanForTweets();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Initial scan
  scanForTweets();

  console.log('[No Clankers] Content script loaded');
})();
