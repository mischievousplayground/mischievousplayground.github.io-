// ============================================================
// MISCHIEVOUS PLAYGROUND — SHARED THEME TOGGLE
// ============================================================
// Inject day/night toggle vào page + handle theme switching.
// Persist choice qua localStorage (key: 'mp-theme').
// Default: follow system preference.
// ============================================================

(function(){
  // ── CSS for the toggle (injected once) ──
  const css = `
  .mp-toggle-wrap{
    position:fixed;top:24px;right:28px;z-index:9999;cursor:none;
  }
  .mp-toggle{
    width:74px;height:36px;
    background:linear-gradient(120deg,#a8c8e8 0%,#e8f1fb 100%);
    border-radius:36px;position:relative;
    box-shadow:inset 2px 3px 6px rgba(0,0,0,.1),0 3px 8px rgba(0,0,0,.12);
    border:2px solid rgba(255,255,255,.6);
    transition:background .6s ease,box-shadow .4s ease,border-color .4s ease;
    cursor:none;
  }
  body.dark .mp-toggle{
    background:linear-gradient(120deg,#1a1635 0%,#332a55 100%);
    border-color:rgba(255,255,255,.15);
    box-shadow:inset 2px 3px 6px rgba(0,0,0,.5),0 3px 12px rgba(120,90,200,.3);
  }
  /* clouds (light) */
  .mp-toggle::before,.mp-toggle::after{
    content:'';position:absolute;background:white;border-radius:50%;
    transition:opacity .4s ease,transform .6s ease;
  }
  .mp-toggle::before{
    width:9px;height:5px;top:8px;right:13px;
    box-shadow:5px 2px 0 -1px white,-4px 1px 0 -2px white;
    opacity:.85;
  }
  .mp-toggle::after{
    width:5px;height:3px;bottom:7px;left:15px;
    box-shadow:4px -1px 0 -1px white;opacity:.7;
  }
  body.dark .mp-toggle::before,
  body.dark .mp-toggle::after{opacity:0;transform:translateX(20px);}
  /* stars (dark) */
  .mp-toggle .mp-stars{
    position:absolute;inset:0;border-radius:36px;overflow:hidden;
    opacity:0;transition:opacity .5s ease .15s;pointer-events:none;
  }
  body.dark .mp-toggle .mp-stars{opacity:1;}
  .mp-toggle .mp-stars span{
    position:absolute;color:#fff8e0;font-size:8px;
    animation:mp-twinkle 2.4s ease-in-out infinite;
  }
  .mp-toggle .mp-stars span:nth-child(1){top:6px;right:13px;animation-delay:0s;}
  .mp-toggle .mp-stars span:nth-child(2){bottom:6px;right:23px;font-size:6px;animation-delay:.6s;}
  .mp-toggle .mp-stars span:nth-child(3){top:11px;right:27px;font-size:5px;animation-delay:1.2s;}
  @keyframes mp-twinkle{0%,100%{opacity:.4;transform:scale(.8);}50%{opacity:1;transform:scale(1.2);}}
  /* sun / moon */
  .mp-toggle .mp-orb{
    position:absolute;top:3px;left:3px;
    width:28px;height:28px;border-radius:50%;
    background:radial-gradient(circle at 30% 30%,#fff5b8 0%,#ffd97d 65%,#f5b94d 100%);
    box-shadow:0 2px 6px rgba(0,0,0,.18),0 0 14px rgba(255,217,125,.6);
    transition:left .5s cubic-bezier(.5,1.4,.6,1),background .5s ease,box-shadow .5s ease;
  }
  body.dark .mp-toggle .mp-orb{
    left:39px;
    background:radial-gradient(circle at 35% 35%,#fffaf0 0%,#e8e2d0 60%,#b5aa90 100%);
    box-shadow:0 2px 6px rgba(0,0,0,.4),0 0 18px rgba(232,226,208,.4);
  }
  .mp-toggle .mp-orb::before,.mp-toggle .mp-orb::after{
    content:'';position:absolute;border-radius:50%;
    background:rgba(150,140,120,.35);
    opacity:0;transition:opacity .4s ease .2s;
  }
  .mp-toggle .mp-orb::before{width:6px;height:6px;top:6px;right:6px;}
  .mp-toggle .mp-orb::after{width:4px;height:4px;bottom:7px;left:8px;}
  body.dark .mp-toggle .mp-orb::before,
  body.dark .mp-toggle .mp-orb::after{opacity:1;}
  @media(max-width:768px){
    .mp-toggle-wrap{top:14px;right:14px;}
  }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── Inject toggle HTML ──
  const wrap = document.createElement('div');
  wrap.className = 'mp-toggle-wrap';
  wrap.title = 'toggle theme';
  wrap.innerHTML = `
    <div class="mp-toggle">
      <div class="mp-stars"><span>✦</span><span>✧</span><span>✦</span></div>
      <div class="mp-orb"></div>
    </div>
  `;
  document.body.appendChild(wrap);

  // ── Theme management ──
  function applyTheme(mode){
    if(mode === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
    // emit event so pages can react (e.g. swap hero image)
    document.dispatchEvent(new CustomEvent('mp-theme-change', { detail: { mode } }));
  }

  const saved = localStorage.getItem('mp-theme');
  if(saved){
    applyTheme(saved);
  }else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
    applyTheme('dark');
  }

  wrap.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark');
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('mp-theme', next);
  });
})();
