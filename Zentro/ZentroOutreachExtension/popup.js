'use strict';

// ─── Constants ────────────────────────────────────────────────────────────────
const LOG_KEY = 'zentro_outreach_log';
const SETTINGS_KEY = 'zentro_settings';

// ─── State ────────────────────────────────────────────────────────────────────
let generatedMessage = '';
let linkedInTabId = null;
let currentDetailId = null;
let overridePending = false;

async function sendToLinkedInTab(tabId, payload) {
  try {
    return await chrome.tabs.sendMessage(tabId, payload);
  } catch {
    // If the content script was not attached (or the page was SPA-navigated), inject and retry.
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js']
    });
    return await chrome.tabs.sendMessage(tabId, payload);
  }
}

// ─── Storage ──────────────────────────────────────────────────────────────────
function getLog() {
  try { return JSON.parse(localStorage.getItem(LOG_KEY) || '[]'); }
  catch { return []; }
}
function saveLog(log) {
  try { localStorage.setItem(LOG_KEY, JSON.stringify(log)); }
  catch (e) {
    if (e.name === 'QuotaExceededError') showNotice('error', '⚠ Storage full — export and clear data.');
  }
}
function getSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'); }
  catch { return {}; }
}

// ─── Utils ────────────────────────────────────────────────────────────────────
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
function escHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function $(id) { return document.getElementById(id); }

// ─── Notices ──────────────────────────────────────────────────────────────────
function showNotice(type, html, id) {
  const area = $('notice-area');
  const div = document.createElement('div');
  div.className = `notice notice-${type}`;
  if (id) div.id = id;
  div.innerHTML = html;
  area.appendChild(div);
  return div;
}
function clearNotices() { $('notice-area').innerHTML = ''; }
function clearNotice(id) { const el = $(id); if (el) el.remove(); }

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  document.querySelectorAll('.tab-content').forEach(c => {
    c.classList.toggle('active', c.id === `tab-${name}`);
    c.classList.toggle('hidden', c.id !== `tab-${name}`);
  });
  if (name === 'history') renderHistory();
  if (name === 'stats') renderStats();
}

// ─── Settings Panel ───────────────────────────────────────────────────────────
function openSettings() {
  const s = getSettings();
  $('setting-name').value = s.your_name || '';
  $('setting-apikey').value = s.openai_api_key || '';
  $('settings-saved').classList.add('hidden');
  $('settings-panel').classList.remove('hidden');
}
function closeSettings() { $('settings-panel').classList.add('hidden'); }

function saveSettings() {
  const s = getSettings();
  const name = $('setting-name').value.trim();
  const apikey = $('setting-apikey').value.trim();
  if (name) s.your_name = name;
  if (apikey) s.openai_api_key = apikey;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  $('settings-saved').classList.remove('hidden');
  setTimeout(() => $('settings-saved').classList.add('hidden'), 1800);
  updateUserBadge();
  validateForm();
}

function clearAllData() {
  if (!confirm('Delete ALL outreach logs and settings? This cannot be undone.')) return;
  localStorage.removeItem(LOG_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  clearForm();
  closeSettings();
  renderHistory();
  renderStats();
  updateUserBadge();
  showNotice('success', '✓ All data cleared.');
  setTimeout(clearNotices, 2500);
}

function updateUserBadge() {
  const s = getSettings();
  const badge = $('user-badge');
  badge.textContent = s.your_name || '';
  badge.style.display = s.your_name ? 'inline' : 'none';
}

// ─── Auto-scrape: detect active LinkedIn tab ──────────────────────────────────
async function detectLinkedInTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.url && tab.url.match(/linkedin\.com\/in\//)) {
    linkedInTabId = tab.id;
    $('scrape-bar').classList.remove('hidden');
    $('not-linkedin').classList.add('hidden');
    $('scrape-status').textContent = 'Ready to scrape profile';
    $('scrape-status').className = 'scrape-status';
  } else {
    linkedInTabId = null;
    $('scrape-bar').classList.add('hidden');
    $('not-linkedin').classList.remove('hidden');
  }
}

async function scrapeFromTab() {
  if (!linkedInTabId) return;
  const statusEl = $('scrape-status');
  statusEl.textContent = 'Scraping profile…';
  statusEl.className = 'scrape-status';

  try {
    const response = await sendToLinkedInTab(linkedInTabId, { type: 'SCRAPE_PROFILE' });
    console.log('[Zentro] SCRAPE_PROFILE response:', response);
    console.log('[Zentro] SCRAPE_PROFILE response JSON:\n' + JSON.stringify(response, null, 2));

    const hasAnyData = !!(
      response?.url ||
      response?.name ||
      response?.company ||
      response?.role ||
      response?.school
    );

    if (hasAnyData) {
      $('linkedin_url').value = response?.url || '';
      $('name').value = response?.name || '';
      $('company').value = response?.company || '';
      $('role').value = response?.role || '';
      $('school').value = response?.school || '';

      const who = response?.name || 'profile';
      const missing = [];
      if (!response?.company) missing.push('company');
      if (!response?.role) missing.push('role');
      if (!response?.school) missing.push('school');

      if (missing.length) {
        statusEl.textContent = `⚠ Scraped ${who}, missing: ${missing.join(', ')} (see console log)`;
        statusEl.className = 'scrape-status warn';
        console.log('[Zentro] Missing fields:', missing);
        console.log('[Zentro] Debug source:', response?.debug || {});
        console.log('[Zentro] Debug source JSON:\n' + JSON.stringify(response?.debug || {}, null, 2));
      } else {
        statusEl.textContent = `✓ Scraped: ${who}`;
        statusEl.className = 'scrape-status success';
      }
      // Check for duplicate after auto-fill
      checkDuplicate();
    } else {
      statusEl.textContent = '⚠ Could not scrape — fill manually';
      statusEl.className = 'scrape-status warn';
    }
  } catch (err) {
    statusEl.textContent = '⚠ Scrape failed — fill manually';
    statusEl.className = 'scrape-status warn';
  }

  validateForm();
}

// ─── Duplicate check ──────────────────────────────────────────────────────────
function checkDuplicate() {
  clearNotice('dup-warn');
  overridePending = false;
  const url = $('linkedin_url').value.trim();
  if (!url) return;
  const log = getLog();
  const dupe = log.find(e => e.linkedin_url === url);
  if (dupe) {
    showNotice('warning',
      `⚠ Already messaged by <b>${escHtml(dupe.messaged_by || 'teammate')}</b> on ${fmtDate(dupe.messaged_at)}.
       <button class="notice-link" id="btn-override-open">Message again?</button>`,
      'dup-warn'
    );
    $('btn-generate').disabled = true;
    $('btn-override-open').addEventListener('click', openOverrideModal);
  }
}

// ─── Override modal ───────────────────────────────────────────────────────────
function openOverrideModal() {
  const url = $('linkedin_url').value.trim();
  const log = getLog();
  const d = log.find(e => e.linkedin_url === url);
  if (d) {
    $('override-msg').textContent =
      `${d.name} was already messaged by ${d.messaged_by || 'a teammate'} on ${fmtDate(d.messaged_at)}. Generate a new message anyway?`;
  }
  $('override-modal').classList.remove('hidden');
}
function closeOverrideModal() { $('override-modal').classList.add('hidden'); }
function confirmOverride() {
  overridePending = true;
  closeOverrideModal();
  clearNotice('dup-warn');
  validateForm();
  generateMessage();
}

// ─── Form validation ──────────────────────────────────────────────────────────
function validateForm() {
  clearNotice('no-api-key');
  const settings = getSettings();
  if (!settings.openai_api_key) {
    showNotice('warning', '⚠ No API key — open <b>Settings ⚙</b> to add it.', 'no-api-key');
  }

  const url = $('linkedin_url').value.trim();
  const name = $('name').value.trim();
  const company = $('company').value.trim();
  const hasKey = !!settings.openai_api_key;

  // Check if there's an unresolved duplicate
  const dupe = url && !overridePending && getLog().find(e => e.linkedin_url === url);
  $('btn-generate').disabled = !(name && company && url && hasKey && !dupe);
}

// ─── Template system prompts ──────────────────────────────────────────────────
function getSystemPrompt(template) {
  const base = 'You write short LinkedIn outreach messages for Zentro. Follow this exact 4-part structure with short paragraphs and no em dash. Paragraph 1: "Hi {firstName}," then congratulate them on their upcoming internship or role at their company and include a warm phrase like "that\'s huge". Avoid duplicated wording like "upcoming incoming". Paragraph 2: mention "My friends and I at UWaterloo are helping 10 incoming SF interns and professionals find housing this week through our AI-native rental marketplace" and include "Our agent uses RL to match preferred listings and can schedule tours for you." Paragraph 3 must have two lines in this order: "If you are still looking for a place this summer in the Bay Area, check it out at joinzentro.com." then "The waitlist is currently open." Paragraph 4: "Best," then sender name. Tone must be genuine and supportive, not salesy. Keep under 75 words total.';
  const extra = {
    faang: ' Mention their company and offer specific help navigating SF intern housing quickly.',
    startup: ' Emphasize practical help: budget fit, neighborhood fit, and roommate options.',
    school: ' Lead with the school connection in a natural way (no forced alumni pitch).',
    high_intent: ' Reference their housing/move signal directly and offer immediate useful help.'
  };
  return base + (extra[template] || '');
}

// ─── Generate message ─────────────────────────────────────────────────────────
async function generateMessage() {
  const settings = getSettings();
  if (!settings.openai_api_key) {
    showNotice('error', '⚠ Add your OpenAI API key in Settings.', 'no-api-key');
    return;
  }

  const name = $('name').value.trim();
  const company = $('company').value.trim();
  const role = $('role').value.trim();
  const school = $('school').value.trim();
  const signal = $('signal').value.trim();
  const template = $('template').value;
  const senderName = settings.your_name?.trim() || 'Rithik';
  const roleForCongrats = (role || 'internship').replace(/^incoming\s+/i, '').trim() || 'internship';

  const out = $('output-area');
  const wc = $('word-count');
  out.textContent = 'Generating…';
  out.classList.add('loading');
  wc.textContent = '';
  $('btn-generate').disabled = true;
  $('btn-copy').disabled = true;
  $('btn-send').disabled = true;
  $('btn-log').disabled = true;
  clearNotice('api-error');
  $('send-status').classList.add('hidden');

  const userMsg = `Write a message for:\nName: ${name}\nCompany: ${company}\nRole: ${role || 'Intern'}\nSchool: ${school || 'Not specified'}\nSignal: ${signal || 'None'}\nTemplate style: ${template}\nSender name: ${senderName}\n\nKeep this close to the target style:\nHi ${name.split(' ')[0] || name},\n\nCongratulations on your upcoming ${roleForCongrats} at ${company}, that's huge! My friends and I at UWaterloo are helping 10 incoming SF interns and professionals find housing this week through our AI-native rental marketplace. Our agent uses RL to match preferred listings and can schedule tours for you.\n\nIf you are still looking for a place this summer in the Bay Area, check it out at joinzentro.com.\nThe waitlist is currently open.\n\nBest,\n${senderName}\n\nRules:\n- Keep structure and phrasing very similar\n- Light personalization is okay\n- Do not create duplicated phrasing like "upcoming incoming"\n- No emoji\n- No em dash`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.openai_api_key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 150,
        temperature: 0.7,
        messages: [
          { role: 'system', content: getSystemPrompt(template) },
          { role: 'user', content: userMsg }
        ]
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error ${res.status}`);
    }

    const data = await res.json();
    generatedMessage = data.choices[0].message.content.trim();

    out.textContent = generatedMessage;
    out.classList.remove('loading');
    const words = generatedMessage.split(/\s+/).filter(Boolean).length;
    wc.textContent = `${words} words`;
    $('btn-copy').disabled = false;
    $('btn-log').disabled = false;
    // Only enable "Open & Fill" if we're on a LinkedIn tab
    $('btn-send').disabled = !linkedInTabId;

  } catch (err) {
    out.innerHTML = '<span style="color:#ff6666">Generation failed.</span>';
    out.classList.remove('loading');
    clearNotice('api-error');
    showNotice('error', `⚠ ${escHtml(err.message)}`, 'api-error');
    generatedMessage = '';
  } finally {
    validateForm();
  }
}

// ─── Copy ─────────────────────────────────────────────────────────────────────
async function copyMessage() {
  if (!generatedMessage) return;
  try {
    await navigator.clipboard.writeText(generatedMessage);
  } catch {
    // Fallback for extension context
    const ta = document.createElement('textarea');
    ta.value = generatedMessage;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  const el = $('copy-confirm');
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 1800);
}

// ─── Open & Fill on LinkedIn ──────────────────────────────────────────────────
async function sendOnLinkedIn() {
  if (!generatedMessage || !linkedInTabId) return;
  const statusEl = $('send-status');
  statusEl.textContent = 'Opening message dialog…';
  statusEl.className = 'send-status visible';

  try {
    const response = await sendToLinkedInTab(linkedInTabId, {
      type: 'INJECT_MESSAGE',
      message: generatedMessage
    });
    if (response && response.success) {
      statusEl.textContent = '✓ Message filled — click Send on LinkedIn';
      statusEl.className = 'send-status visible success';
      // Focus the LinkedIn tab
      chrome.tabs.update(linkedInTabId, { active: true });
    } else {
      statusEl.textContent = `⚠ ${response?.reason || 'Could not fill — paste manually'}`;
      statusEl.className = 'send-status visible warn';
      // Copy to clipboard as fallback
      await copyMessage();
    }
  } catch (err) {
    statusEl.textContent = '⚠ Could not reach tab — message copied to clipboard';
    statusEl.className = 'send-status visible warn';
    await copyMessage();
  }
}

// ─── Log & Next ───────────────────────────────────────────────────────────────
function logAndNext() {
  const settings = getSettings();
  const entry = {
    id: uuid(),
    linkedin_url: $('linkedin_url').value.trim(),
    name: $('name').value.trim(),
    company: $('company').value.trim(),
    role: $('role').value.trim(),
    school: $('school').value.trim(),
    signal: $('signal').value.trim(),
    template: $('template').value,
    message: generatedMessage,
    messaged_by: settings.your_name || 'Unknown',
    messaged_at: new Date().toISOString(),
    status: 'messaged'
  };
  const log = getLog();
  log.unshift(entry);
  saveLog(log);

  showNotice('success', `✓ Logged <b>${escHtml(entry.name)}</b> at ${escHtml(entry.company)}.`);
  setTimeout(clearNotices, 2500);

  clearForm();
  // Trigger re-scrape if still on a LinkedIn tab
  if (linkedInTabId) detectLinkedInTab();
}

// ─── Clear Form ───────────────────────────────────────────────────────────────
function clearForm() {
  ['linkedin_url', 'name', 'company', 'role', 'school', 'signal'].forEach(id => $(id).value = '');
  $('template').value = 'faang';
  $('output-area').textContent = 'Message will appear here…';
  $('output-area').classList.remove('loading');
  $('word-count').textContent = '';
  $('btn-copy').disabled = true;
  $('btn-send').disabled = true;
  $('btn-log').disabled = true;
  $('copy-confirm').classList.add('hidden');
  $('send-status').classList.add('hidden');
  clearNotices();
  generatedMessage = '';
  overridePending = false;
  validateForm();
}

// ─── History ──────────────────────────────────────────────────────────────────
function renderHistory() {
  const log = getLog();
  const list = $('history-list');
  const empty = $('history-empty');
  list.innerHTML = '';

  if (!log.length) { empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');

  log.forEach(entry => {
    const card = document.createElement('div');
    card.className = 'history-card';
    card.innerHTML = `
      <div class="hc-top">
        <div>
          <div class="hc-name">${escHtml(entry.name)}</div>
          <div class="hc-sub">${escHtml(entry.company)} · <span class="mono upper">${entry.template}</span></div>
        </div>
        <span class="status-badge status-${entry.status}">${statusLabel(entry.status)}</span>
      </div>
      <div class="hc-meta">${fmtDate(entry.messaged_at)} · ${escHtml(entry.messaged_by || '—')}</div>
    `;
    card.addEventListener('click', () => openDetail(entry.id));
    list.appendChild(card);
  });
}

function statusLabel(s) {
  return { messaged: 'Messaged', replied: 'Replied', converted: 'Converted', no_response: 'No Response' }[s] || s;
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function openDetail(id) {
  const log = getLog();
  const entry = log.find(e => e.id === id);
  if (!entry) return;
  currentDetailId = id;

  $('modal-name').textContent = entry.name;
  $('modal-body').innerHTML = `
    <div class="detail-grid">
      <div><div class="dl">Company</div><div class="dv">${escHtml(entry.company)}</div></div>
      <div><div class="dl">Role</div><div class="dv">${escHtml(entry.role || '—')}</div></div>
      <div><div class="dl">School</div><div class="dv">${escHtml(entry.school || '—')}</div></div>
      <div><div class="dl">Template</div><div class="dv mono upper">${entry.template}</div></div>
    </div>
    ${entry.signal ? `<div class="detail-row"><div class="dl">Signal</div><div class="dv">${escHtml(entry.signal)}</div></div>` : ''}
    <div class="detail-row"><div class="dl">URL</div><div class="dv"><a href="${escHtml(entry.linkedin_url)}" target="_blank" class="link">${escHtml(entry.linkedin_url)}</a></div></div>
    <div class="detail-row"><div class="dl">Message</div><div class="message-output sm">${escHtml(entry.message)}</div></div>
  `;
  $('modal-status-select').value = entry.status;
  $('detail-modal').classList.remove('hidden');
}

function closeModal() {
  if (currentDetailId) {
    const log = getLog();
    const entry = log.find(e => e.id === currentDetailId);
    if (entry) {
      entry.status = $('modal-status-select').value;
      saveLog(log);
    }
  }
  $('detail-modal').classList.add('hidden');
  currentDetailId = null;
  if ($('tab-history').classList.contains('active')) renderHistory();
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function renderStats() {
  const log = getLog();
  const today = new Date().toDateString();
  $('stat-today').textContent = log.filter(e => new Date(e.messaged_at).toDateString() === today).length;
  $('stat-total').textContent = log.length;
  $('stat-companies').textContent = new Set(log.map(e => e.company.trim().toLowerCase()).filter(Boolean)).size;
  $('stat-replies').textContent = log.filter(e => e.status === 'replied' || e.status === 'converted').length;

  // By template
  const counts = {};
  log.forEach(e => { counts[e.template] = (counts[e.template] || 0) + 1; });
  const breakdown = $('template-breakdown');
  breakdown.innerHTML = '';
  Object.entries(counts).sort((a, b) => b[1] - a[1]).forEach(([tmpl, count]) => {
    const row = document.createElement('div');
    row.className = 'tmpl-row';
    row.innerHTML = `<span class="mono upper">${escHtml(tmpl)}</span><span class="tmpl-count">${count}</span>`;
    breakdown.appendChild(row);
  });
  if (!Object.keys(counts).length) breakdown.innerHTML = '<div class="empty-state">No data yet.</div>';
}

// ─── CSV Export ───────────────────────────────────────────────────────────────
function exportCSV() {
  const log = getLog();
  if (!log.length) { showNotice('warning', '⚠ No data to export.'); setTimeout(clearNotices, 2000); return; }
  const headers = ['id', 'name', 'company', 'role', 'school', 'linkedin_url', 'signal', 'template', 'message', 'messaged_by', 'messaged_at', 'status'];
  const rows = log.map(e => headers.map(h => `"${String(e[h] || '').replace(/"/g, '""')}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = `zentro-outreach-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ─── Event Wiring ─────────────────────────────────────────────────────────────
function wireEvents() {
  // Tabs
  document.querySelectorAll('.tab').forEach(t =>
    t.addEventListener('click', () => switchTab(t.dataset.tab))
  );

  // Settings
  $('btn-settings').addEventListener('click', openSettings);
  $('btn-close-settings').addEventListener('click', closeSettings);
  $('btn-save-settings').addEventListener('click', saveSettings);
  $('btn-clear-data').addEventListener('click', clearAllData);

  // Compose
  $('btn-scrape').addEventListener('click', scrapeFromTab);
  $('btn-generate').addEventListener('click', generateMessage);
  $('btn-clear').addEventListener('click', clearForm);
  $('btn-copy').addEventListener('click', copyMessage);
  $('btn-send').addEventListener('click', sendOnLinkedIn);
  $('btn-log').addEventListener('click', logAndNext);

  // URL dedup
  $('linkedin_url').addEventListener('input', () => { checkDuplicate(); validateForm(); });
  ['name', 'company', 'role', 'school'].forEach(id =>
    $(id).addEventListener('input', validateForm)
  );

  // Override modal
  $('btn-override-confirm').addEventListener('click', confirmOverride);
  $('btn-override-cancel').addEventListener('click', closeOverrideModal);
  $('override-modal').addEventListener('click', e => { if (e.target === e.currentTarget) closeOverrideModal(); });

  // Detail modal
  $('btn-close-modal').addEventListener('click', closeModal);
  $('detail-modal').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });

  // History
  $('btn-export').addEventListener('click', exportCSV);

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!$('detail-modal').classList.contains('hidden')) closeModal();
      if (!$('override-modal').classList.contains('hidden')) closeOverrideModal();
      if (!$('settings-panel').classList.contains('hidden')) closeSettings();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (!$('btn-generate').disabled) generateMessage();
    }
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
(async function init() {
  wireEvents();
  updateUserBadge();
  validateForm();
  await detectLinkedInTab();
})();
