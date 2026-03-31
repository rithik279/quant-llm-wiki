// ─── Zentro Outreach — Content Script ────────────────────────────────────────
// Runs on linkedin.com/in/* pages
// Responsibilities:
//   1. Scrape profile data from the DOM
//   2. Inject a pre-written message into LinkedIn's message compose window

'use strict';

// ─── Scraping ─────────────────────────────────────────────────────────────────

function getText(selector, root = document) {
  const el = root.querySelector(selector);
  if (!el) return '';
  return (el.innerText || el.textContent || '').trim();
}

function getFirstText(selectors, root = document) {
  for (const selector of selectors) {
    const text = getText(selector, root);
    if (text) return text;
  }
  return '';
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function roleQuality(role) {
  const r = normalizeText(role);
  if (!r) return 0;
  const lower = r.toLowerCase();
  if (/^(incoming|student|open to work|seeking opportunities?)$/.test(lower)) return 1;
  if (r.split(' ').length <= 2) return 2;
  if (/\b(intern|engineer|developer|manager|analyst|researcher)\b/i.test(r)) return 4;
  return 3;
}

function pickBetterRole(currentRole, candidateRole) {
  const current = normalizeText(currentRole);
  const candidate = normalizeText(candidateRole);
  if (!candidate) return current;
  if (!current) return candidate;

  const currentScore = roleQuality(current);
  const candidateScore = roleQuality(candidate);

  if (candidateScore > currentScore) return candidate;
  if (candidateScore === currentScore && candidate.length > current.length) return candidate;
  return current;
}

function parseHeadlineParts(headline) {
  const text = normalizeText(headline);
  if (!text) return { role: '', company: '', school: '' };

  let role = '';
  let company = '';
  let school = '';

  const roleMatch = text.match(/^(.*?)(?:\s+@\s+|\s+at\s+)/i);
  if (roleMatch?.[1]) role = normalizeText(roleMatch[1]);

  const companyMatch = text.match(/(?:@|\bat\b)\s*([^|·]+)/i);
  if (companyMatch?.[1]) company = normalizeText(companyMatch[1]);

  const schoolAtMatch = text.match(/\|\s*[^|@]*@\s*([^|·]+)/i);
  if (schoolAtMatch?.[1]) school = normalizeText(schoolAtMatch[1]);

  if (!school) {
    const tail = text.split('|').map(normalizeText).filter(Boolean).pop() || '';
    if (tail && !/\b(incoming|intern|engineer|developer|student)\b/i.test(tail)) {
      school = tail;
    }
  }

  return { role, company, school };
}

function getSectionByHeading(profileRoot, headingNeedle) {
  const sections = Array.from(profileRoot.querySelectorAll('section'));
  const needle = headingNeedle.toLowerCase();
  for (const section of sections) {
    const heading = normalizeText(
      section.querySelector('h1, h2, h3, .pvs-header__title, [aria-label]')?.innerText ||
      section.innerText.split('\n')[0] ||
      ''
    ).toLowerCase();
    if (heading.includes(needle)) return section;
  }
  return null;
}

function findContainerNearName(nameEl) {
  if (!nameEl) return null;
  let node = nameEl;
  for (let i = 0; i < 6 && node; i++) {
    const text = normalizeText(node.innerText || '');
    if (text.length >= 40 && text.length <= 1800) return node;
    node = node.parentElement;
  }
  return nameEl.parentElement || null;
}

function parseTopCardText(text) {
  const normalized = normalizeText(text);
  if (!normalized) return { role: '', company: '', school: '' };

  const lines = text
    .split('\n')
    .map(normalizeText)
    .filter(Boolean)
    .filter(line => line.length <= 140);

  const candidates = lines.filter(line =>
    (line.includes('@') || /\bat\b/i.test(line)) &&
    (line.includes('|') || line.includes('·'))
  );

  const line = candidates[0] || lines.find(l => (l.includes('@') || /\bat\b/i.test(l))) || '';
  if (!line) return { role: '', company: '', school: '' };

  const parts = line.split(/[|·]/).map(normalizeText).filter(Boolean);
  const first = parts[0] || '';
  const second = parts[1] || '';

  let role = '';
  let company = '';
  let school = '';

  const firstMatch = first.match(/^(.*?)(?:\s+@\s+|\s+at\s+)(.+)$/i);
  if (firstMatch) {
    role = normalizeText(firstMatch[1]);
    company = normalizeText(firstMatch[2]);
  }

  if (second) {
    const schoolMatch = second.match(/(?:.*?@\s*)?(.+)$/i);
    if (schoolMatch?.[1]) school = normalizeText(schoolMatch[1]);
  }

  return { role, company, school };
}

function parseFromVisiblePageText(profileRoot, name) {
  const raw = profileRoot?.innerText || '';
  const lines = raw
    .split('\n')
    .map(normalizeText)
    .filter(Boolean);

  const firstChunk = lines.slice(0, 80);
  const normalizedName = normalizeText(name).toLowerCase();

  const headlineLine = firstChunk.find(line => {
    const lower = line.toLowerCase();
    if (!line || line.length > 140) return false;
    if (normalizedName && lower === normalizedName) return false;
    if (lower.includes('connections') || lower.includes('contact info')) return false;
    return (line.includes('@') || /\bat\b/i.test(line)) && (line.includes('|') || line.includes('·'));
  }) || '';

  const parsedHeadline = parseTopCardText(headlineLine);

  let school = '';
  const eduIdx = lines.findIndex(line => /^education$/i.test(line));
  if (eduIdx >= 0) {
    for (let i = eduIdx + 1; i < Math.min(lines.length, eduIdx + 8); i++) {
      const candidate = lines[i];
      if (!candidate) continue;
      if (/^(experience|skills|activities|licenses|certifications)$/i.test(candidate)) break;
      if (candidate.length <= 70 && !/\b(bachelor|master|degree|present|mo|yr|years?)\b/i.test(candidate)) {
        school = candidate;
        break;
      }
    }
  }

  let role = '';
  let company = '';
  const expIdx = lines.findIndex(line => /^experience$/i.test(line));
  if (expIdx >= 0) {
    for (let i = expIdx + 1; i < Math.min(lines.length, expIdx + 8); i++) {
      const candidate = lines[i];
      if (!candidate) continue;
      if (candidate.length <= 120 && /\b(intern|engineer|developer|manager|analyst|incoming|software)\b/i.test(candidate)) {
        role = pickBetterRole(role, candidate);
        continue;
      }
      if (!company && candidate.length <= 120 && (candidate.includes('·') || /\b(inc|llc|google|meta|apple|amazon|microsoft|deepmind|stripe|notion|figma|airbnb)\b/i.test(candidate))) {
        company = normalizeText(candidate.split('·')[0]);
      }
      if (role && company) break;
    }
  }

  return {
    role: pickBetterRole(role, parsedHeadline.role),
    company: parsedHeadline.company || company,
    school: parsedHeadline.school || school,
    headlineLine
  };
}

function getSectionRoot(profileRoot, anchorId, viewName) {
  const anchor = profileRoot.querySelector(`#${anchorId}`);
  if (anchor) {
    const section = anchor.closest('section');
    if (section) return section;
  }
  return profileRoot.querySelector(`section[data-view-name*="${viewName}"]`) || null;
}

function firstNonEmptyText(selectors, root) {
  for (const selector of selectors) {
    const el = root.querySelector(selector);
    if (!el) continue;
    const text = normalizeText(el.innerText || el.textContent || '');
    if (text) return text;
  }
  return '';
}

function scrapeProfile() {
  const url = window.location.href.split('?')[0].replace(/\/$/, ''); // strip query params

  const profileRoot = document.querySelector('main') || document;

  // Name — LinkedIn's DOM is highly variant, so try several top-card selectors first.
  let name = getFirstText([
    'main h1',
    '.pv-text-details__left-panel h1',
    '.ph5 h1',
    'h1'
  ], profileRoot);

  if (!name) {
    const ogTitle = document.querySelector('meta[property="og:title"]')?.content || '';
    name = normalizeText(ogTitle.split('|')[0]);
  }

  if (!name) {
    name = normalizeText((document.title || '').split('|')[0]);
  }

  const nameEl = profileRoot.querySelector('h1') || document.querySelector('h1');

  // Headline — sits right below the name in the intro card
  let headline = getFirstText([
    '.text-body-medium.break-words',
    '.pv-text-details__left-panel .text-body-medium',
    '[data-generated-suggestion-target] .text-body-medium',
    '.pv-text-details__left-panel .t-14.t-black--light',
    '.pv-text-details__left-panel [dir="ltr"]'
  ], profileRoot);

  if (!headline) {
    const ogDesc = document.querySelector('meta[property="og:description"]')?.content || '';
    headline = normalizeText(ogDesc);
  }

  // Last-resort top-card text parse for layouts where classes are unstable.
  const topCardContainer = findContainerNearName(nameEl);
  const topCardParsed = parseTopCardText(topCardContainer?.innerText || '');
  const pageTextParsed = parseFromVisiblePageText(profileRoot, name);

  // Company & role — try the "About" intro panel first (the compact pills),
  // then fall back to the first experience card.
  let company = '';
  let role = '';

  // Intro panel: each <li> has an SVG icon + text; the briefcase icon = company
  const introPanelItems = profileRoot.querySelectorAll(
    '.pv-text-details__right-panel .pvs-list > li, ' +
    '.pv-text-details__right-panel li'
  );
  for (const li of introPanelItems) {
    const svg = li.querySelector('svg use');
    const label = svg ? (svg.getAttribute('href') || svg.getAttribute('xlink:href') || '') : '';
    const text = li.innerText.trim();
    if (label.includes('company') || label.includes('work') || label.includes('building')) {
      company = text; break;
    }
  }

  // If intro panel didn't work, try the first experience section entry
  if (!company) {
    const experienceRoot = getSectionRoot(profileRoot, 'experience', 'experience') || getSectionByHeading(profileRoot, 'experience');
    const expSection = experienceRoot?.querySelector('li') || null;
    if (expSection) {
      // Structure: role title (bold) / company name (lighter)
      const spans = expSection.querySelectorAll('.mr1.t-bold span[aria-hidden="true"], .t-14.t-normal span[aria-hidden="true"]');
      if (spans.length >= 2) {
        role = normalizeText(spans[0].innerText);
        company = normalizeText(spans[1].innerText);
      } else if (spans.length === 1) {
        company = normalizeText(spans[0].innerText);
      }
    }
  }

  // Secondary fallback for role/company directly from the Experience section layout.
  if (!role || !company) {
    const experienceRoot = getSectionRoot(profileRoot, 'experience', 'experience') || getSectionByHeading(profileRoot, 'experience');
    if (experienceRoot) {
      const firstExpItem = experienceRoot.querySelector('li');
      if (firstExpItem) {
        if (!role) {
          role = firstNonEmptyText([
            '.display-flex.align-items-center.mr1.t-bold span[aria-hidden="true"]',
            '.mr1.t-bold span[aria-hidden="true"]',
            'a[data-field="experience_company_logo"] ~ div .t-bold span[aria-hidden="true"]'
          ], firstExpItem);

          if (!role) {
            const expLines = (firstExpItem.innerText || '')
              .split('\n')
              .map(normalizeText)
              .filter(Boolean)
              .filter(line => line.length <= 120);
            const expRoleFromLines = expLines.find(line => /\b(intern|engineer|developer|manager|analyst|software)\b/i.test(line)) || '';
            role = pickBetterRole(role, expRoleFromLines);
          }
        }

        if (!company) {
          const rawCompany = firstNonEmptyText([
            '.t-14.t-normal span[aria-hidden="true"]',
            '.t-black--light span[aria-hidden="true"]',
            'a[href*="/company/"] span[aria-hidden="true"]'
          ], firstExpItem);
          company = normalizeText(rawCompany.split('·')[0]);
        }
      }
    }
  }

  // Fallback: current role and company are often shown as top-card "pill" links.
  if (!company) {
    const topCardLinks = Array.from(profileRoot.querySelectorAll(
      '.pv-text-details__left-panel a[href*="/company/"], ' +
      '.pv-text-details__left-panel .inline-show-more-text a, ' +
      '.pv-text-details__left-panel a[data-field="experience_company_logo"]'
    ));
    const firstCompany = topCardLinks
      .map(a => normalizeText(a.innerText))
      .find(Boolean);
    if (firstCompany) company = firstCompany;
  }

  // Role — use headline if we still have nothing
  if (!role) role = headline;

  // School — first education section entry
  let school = '';
  const educationRoot = getSectionRoot(profileRoot, 'education', 'education') || getSectionByHeading(profileRoot, 'education');
  const eduSection = educationRoot?.querySelector('li') || null;
  if (eduSection) {
    school = firstNonEmptyText([
      '.mr1.t-bold span[aria-hidden="true"]',
      '.display-flex.align-items-center.mr1.t-bold span[aria-hidden="true"]',
      'a[href*="/school/"] span[aria-hidden="true"]',
      '.t-bold span[aria-hidden="true"]'
    ], eduSection);
  }

  // Fallbacks from headline/meta for top-card formats like:
  // "Incoming @ Google DeepMind | CS @ UCLA"
  const headlineParts = parseHeadlineParts(headline);

  if (headlineParts.role) role = pickBetterRole(role, headlineParts.role);
  if (!company && headlineParts.company) company = headlineParts.company;
  if (!school && headlineParts.school) school = headlineParts.school;

  if (topCardParsed.role) role = pickBetterRole(role, topCardParsed.role);
  if (!company && topCardParsed.company) company = topCardParsed.company;
  if (!school && topCardParsed.school) school = topCardParsed.school;

  if (pageTextParsed.role) role = pickBetterRole(role, pageTextParsed.role);
  if (!company && pageTextParsed.company) company = pageTextParsed.company;
  if (!school && pageTextParsed.school) school = pageTextParsed.school;

  // Fallback: parse school from headline — "X at Stripe | Stanford University"
  if (!school && headline) {
    const match = headline.match(/[|@·]\s*(.+)$/);
    if (match) school = match[1].trim();
  }

  const result = {
    url,
    name: normalizeText(name),
    headline: normalizeText(headline),
    company: normalizeText(company),
    role: normalizeText(role),
    school: normalizeText(school),
    debug: {
      source: {
        headline: !!headline,
        headlineParts,
        topCardParsed,
        pageTextParsed,
        hasExperienceSection: !!(getSectionRoot(profileRoot, 'experience', 'experience') || getSectionByHeading(profileRoot, 'experience')),
        hasEducationSection: !!(getSectionRoot(profileRoot, 'education', 'education') || getSectionByHeading(profileRoot, 'education'))
      },
      snippets: {
        headline: normalizeText(headline).slice(0, 180),
        topCard: normalizeText(topCardContainer?.innerText || '').slice(0, 180)
      }
    }
  };

  return result;
}

async function scrapeProfileWithRetries() {
  const attempts = 7;
  const delayMs = 300;
  const attemptSnapshots = [];

  let best = scrapeProfile();
  let bestScore = scoreProfile(best);
  attemptSnapshots.push(snapshotProfile(best, 1));

  for (let i = 1; i < attempts; i++) {
    if (best.role && best.school && best.company) break;
    await sleep(delayMs);
    const next = scrapeProfile();
    attemptSnapshots.push(snapshotProfile(next, i + 1));
    const score = scoreProfile(next);
    if (score > bestScore) {
      best = next;
      bestScore = score;
    }
  }

  best.debug = {
    ...(best.debug || {}),
    retries: {
      attemptsTried: attemptSnapshots.length,
      bestScore,
      snapshots: attemptSnapshots
    }
  };

  return best;
}

function snapshotProfile(profile, attemptNo) {
  return {
    attempt: attemptNo,
    name: profile?.name || '',
    company: profile?.company || '',
    role: profile?.role || '',
    school: profile?.school || '',
    score: scoreProfile(profile)
  };
}

function scoreProfile(profile) {
  return [profile?.name, profile?.company, profile?.role, profile?.school]
    .filter(Boolean)
    .length;
}

// ─── Message Injection ────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function waitForFirstSelector(selectors, timeoutMs = 8000, pollMs = 150) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el) return el;
    }
    await sleep(pollMs);
  }
  return null;
}

function setComposeText(compose, text) {
  compose.focus();

  // Some editors expose a value property.
  if (typeof compose.value === 'string') {
    compose.value = text;
    compose.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  }

  // Try insertion through the current selection first.
  try {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(compose);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('selectAll', false, null);
    document.execCommand('insertText', false, text);
  } catch {
    // Continue with fallback below.
  }

  if (!normalizeText(compose.innerText || compose.textContent || '')) {
    // Fallback when execCommand is ignored by the editor implementation.
    compose.textContent = text;
  }

  compose.dispatchEvent(new InputEvent('input', {
    bubbles: true,
    cancelable: true,
    inputType: 'insertText',
    data: text
  }));

  return normalizeText(compose.innerText || compose.textContent || '').includes(normalizeText(text).slice(0, 8));
}

async function injectMessage(text) {
  const composeSelectors = [
    '.msg-form__contenteditable[contenteditable="true"]',
    '.msg-form__contenteditable[role="textbox"]',
    '.msg-form__msg-content-container [contenteditable="true"]',
    'div[role="textbox"][contenteditable="true"]',
    'div.msg-form__contenteditable'
  ];

  // 1) If a composer is already open, fill directly.
  let compose = document.querySelector(composeSelectors.join(', '));

  // 2) Otherwise click a message action and wait for composer.
  if (!compose) {
    const msgButton = document.querySelector(
      'button[aria-label^="Message"], ' +
      'button[aria-label*="Message"], ' +
      'a[aria-label^="Message"], ' +
      '.pvs-profile-actions button:not([aria-label*="Connect"]):not([aria-label*="Follow"]):not([aria-label*="More"])'
    );

    if (!msgButton) {
      return { success: false, reason: 'Message button not found on page.' };
    }

    msgButton.scrollIntoView({ block: 'center', inline: 'center' });
    msgButton.click();
    compose = await waitForFirstSelector(composeSelectors, 9000, 150);
  }

  if (!compose) {
    return { success: false, reason: 'Message compose box not found after opening chat.' };
  }

  const ok = setComposeText(compose, text);
  if (!ok) {
    return { success: false, reason: 'Compose box opened but text insertion failed.' };
  }

  return { success: true };
}

// ─── Message Listener ─────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'PING') {
    sendResponse({ ok: true });
    return false;
  }

  if (msg.type === 'SCRAPE_PROFILE') {
    scrapeProfileWithRetries()
      .then(sendResponse)
      .catch(() => sendResponse(scrapeProfile()));
    return true;
  }

  if (msg.type === 'INJECT_MESSAGE') {
    injectMessage(msg.message)
      .then(sendResponse)
      .catch(err => sendResponse({ success: false, reason: err.message }));
    return true; // keep channel open for async response
  }
});
