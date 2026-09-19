/*!
 * FusionEra License Check — النسخة النهائية المستضافة أونلاين
 * https://ahmed-hamed-216.github.io/seplus_licenses/license-check.js
 * ------------------------------------------------------------
 * التركيب في قالب بلوجر (سطرين قبل </body>):
 *
 *   <script>window.FE_LIC={blogid:"<data:blog.blogId/>"};</script>
 *   <script src="https://ahmed-hamed-216.github.io/seplus_licenses/license-check.js"></script>
 *
 * البيانات: /licenses.json في نفس الـ repo (عدّلها من موقع GitHub مباشرة)
 */
(function () {
  'use strict';

  var cfg = window.FE_LIC || {};
  var DATA_URL  = 'https://ahmed-hamed-216.github.io/seplus_licenses/licenses.json';
  var FALLBACK  = 'https://cdn.jsdelivr.net/gh/Ahmed-Hamed-216/seplus_licenses@main/licenses.json';
  var CACHE_HOURS = 6;

  /* ---- BlogID ---- */
  var id = String(cfg.blogid || '');
  if (!/^\d+$/.test(id)) {
    var m = location.href.match(/blogID=(\d+)/);
    id = (m && m[1]) || '';
  }
  if (!id) return;

  /* ---- كاش محلي ---- */
  var KEY = '_fe_lic_' + id;
  try {
    var c = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (c && (Date.now() - c.t) < CACHE_HOURS * 3600 * 1000) return render(c.d);
  } catch (e) {}

  /* ---- جلب البيانات ---- */
  fetch(DATA_URL, { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .catch(function () {
      return fetch(FALLBACK, { cache: 'no-cache' }).then(function (r) {
        if (!r.ok) throw 0; return r.json();
      });
    })
    .then(function (db) {
      var d = evaluate(db, id);
      try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), d: d })); } catch (e) {}
      render(d);
    })
    .catch(function () { /* الشبكة واقفة — مفيش حاجة تظهر */ });

  function evaluate(db, blogId) {
    if (!db) return { ok: false };
    var act = db.active || [];
    for (var i = 0; i < act.length; i++) {
      if (String(act[i].blogid) === blogId) {
        return { ok: true, activated: true, plan: act[i].plan || 'basic' };
      }
    }
    var sus = db.suspended || [];
    for (var j = 0; j < sus.length; j++) {
      if (String(sus[j].blogid) === blogId) return { ok: true, activated: false, reason: 'suspended' };
    }
    return { ok: true, activated: false };
  }

  function render(d) {
    if (!d || !d.ok) return;
    if (d.activated) {
      document.documentElement.setAttribute('data-licensed', '1');
      return;
    }
    // معاينة/دخول المدير من بلوجر — مفيش تنبيه
    if (/blogger\.com/.test(document.referrer || '')) return;
    var bar = document.createElement('div');
    bar.setAttribute('style', [
      'position:fixed', 'bottom:0', 'left:0', 'right:0', 'z-index:99999',
      'background:#b3261e', 'color:#fff', 'padding:10px 16px',
      'font:13px Tahoma,sans-serif', 'text-align:center',
      'direction:rtl', 'box-shadow:0 -2px 10px rgba(0,0,0,.25)'
    ].join(';'));
    bar.innerHTML = 'هذا القالب غير مفعّل على هذه المدونة — ' +
      '<a href="#" style="color:#ffd;text-decoration:underline">تواصل معنا للتفعيل</a>';
    document.body.appendChild(bar);
  }
})();
