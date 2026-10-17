// Arabic RTL fix for Claude: a line that starts with an English word ("frustrating: الـ T …")
// is laid out left to right, so its Arabic reads backwards. This marks every block that is
// mostly Arabic as right to left (and every list or table whose items mostly are), and keeps
// watching the page so replies are fixed while they stream in.
(() => {
  const ARABIC = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/g;
  const LATIN = /[A-Za-z]/g;
  const BLOCKS = 'p, li, h1, h2, h3, h4, h5, h6, td, th, blockquote, dd, dt, ul, ol, table';

  /** 'rtl' when Arabic letters are at least half as many as Latin ones, 'ltr' when there are some Latin, else null. */
  function directionOf(text) {
    const ar = (text.match(ARABIC) || []).length;
    const en = (text.match(LATIN) || []).length;
    if (!ar && !en) return null;
    return ar * 2 >= en ? 'rtl' : 'ltr';
  }

  function fix(el) {
    // Code, the message box and anything being edited are left alone.
    if (el.closest('pre, code, [contenteditable="true"], textarea')) return;
    const dir = directionOf(el.textContent || '');
    if (dir === 'rtl') {
      if (el.dataset.rtlFix !== 'rtl') {
        el.dataset.rtlFix = 'rtl';
        el.setAttribute('dir', 'rtl');
      }
    } else if (el.dataset.rtlFix === 'rtl') {
      delete el.dataset.rtlFix;
      el.removeAttribute('dir');
    }
  }

  let queued = false;
  function scan() {
    queued = false;
    document.querySelectorAll(BLOCKS).forEach(fix);
  }
  function schedule() {
    if (queued) return;
    queued = true;
    setTimeout(scan, 150);
  }

  scan();
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true, characterData: true });
})();
