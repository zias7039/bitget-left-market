(() => {
'use strict';
if (window.__asideLeftMarketInstalled) return;
window.__asideLeftMarketInstalled = true;
const css = "\n[data-aside-market-main] {margin-left:350px!important;width:calc(100% - 350px)!important;min-width:768px!important;}\n[data-aside-market-main] .status-footer-wrapper {left:350px!important;width:calc(100% - 350px)!important;}\n[data-aside-market-popup] {position:fixed!important;inset:calc(var(--aside-market-top, 118px) + 40px) auto 28px 0!important;width:350px!important;min-width:350px!important;height:auto!important;padding:0!important;transform:none!important;display:block!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;z-index:950!important;}\n[data-aside-market-popup] > .tVv2dOSHDv7Z8X4qxxVy {width:350px!important;height:100%!important;max-height:none!important;border-radius:0!important;border:0!important;border-right:1px solid #303438!important;box-shadow:none!important;}\n[data-aside-market-popup] .bit-tabs-tab {margin-left:0!important;margin-right:16px!important;}\n[data-aside-market-popup] .bit-tabs-nav {margin-bottom:0!important;}\n[data-aside-market-popup] .ntsaY8NWVG4pGNyitRei .cursor-pointer {padding-left:10px!important;padding-right:10px!important;}\n[data-aside-market-popup] .ntsaY8NWVG4pGNyitRei .w-20 {width:60px!important;}\n#aside-market-bar {position:fixed;left:0;top:var(--aside-market-top, 118px);width:350px;height:40px;z-index:951;background:#141618;color:#e8ecef;border-right:1px solid #303438;border-bottom:1px solid #303438;display:flex;align-items:center;justify-content:space-between;padding:0 12px;box-sizing:border-box;font:600 13px sans-serif;}\n#aside-market-bar button {border:1px solid #394045;background:#22282b;color:#adb8be;border-radius:6px;padding:4px 8px;cursor:pointer;font:12px sans-serif;}\n\n[data-aside-market-popup] .rc-scrollbars-view .cursor-pointer > div:first-child > img {display:none!important;}\n[data-aside-market-popup] .rc-scrollbars-view .cursor-pointer > div:first-child > div:last-child {margin-left:6px!important;}\n[data-aside-market-popup] .rc-scrollbars-view .cursor-pointer > div:first-child > div:last-child > div:first-child > div:last-child {display:none!important;}\n[data-aside-market-popup] .rc-scrollbars-view .cursor-pointer > div:nth-child(2) {flex:0 0 75px!important;padding:0 4px!important;margin-left:2px!important;}\n[data-aside-market-popup] .rc-scrollbars-view .cursor-pointer > div:nth-child(3) {flex:0 0 60px!important;}\n";
let enabled = true, queued = false, lastOpen = 0, main = null, popup = null;
const validRoute = () => /^\/(?:asia\/)?futures\/usdt\/[^/]+\/?$/.test(location.pathname);
function clean() {
 const trigger = document.querySelector('.NWcPpLd85RQE5EQA6WAk')?.closest('.bit-dropdown-trigger');
 trigger?.dispatchEvent(new MouseEvent('mouseout', {bubbles:true,view:window,relatedTarget:document.body}));
 popup?.dispatchEvent(new MouseEvent('mouseout', {bubbles:true,view:window,relatedTarget:document.body}));
 document.getElementById('aside-market-style')?.remove();
 document.getElementById('aside-market-bar')?.remove();
 document.querySelectorAll('[data-aside-market-main], [data-aside-market-popup]').forEach(el => {el.removeAttribute('data-aside-market-main');el.removeAttribute('data-aside-market-popup');});
 document.documentElement.style.removeProperty('--aside-market-top');
 main = popup = null;
}
function sync() {
 queued = false;
 if (!enabled || !validRoute()) { if (main || document.getElementById('aside-market-style')) clean(); return; }
 const symbol = document.querySelector('.NWcPpLd85RQE5EQA6WAk');
 const grid = symbol?.closest('.react-grid-layout');
 const target = grid?.parentElement?.parentElement;
 if (!target) return;
 const nativePanel = document.querySelector('.tVv2dOSHDv7Z8X4qxxVy');
 const nativePopup = nativePanel?.closest('.bit-dropdown');
 if (!nativePopup) {
   if (Date.now() - lastOpen > 2500) {
     const trigger = symbol.closest('.bit-dropdown-trigger');
     if (trigger) {lastOpen = Date.now(); trigger.dispatchEvent(new MouseEvent('mouseover', {bubbles:true, view:window, relatedTarget:document.body}));}
   }
   return;
 }
 main = target; popup = nativePopup;
 if (!document.getElementById('aside-market-style')) {
   const style = document.createElement('style');style.id = 'aside-market-style';style.textContent = css;document.head.appendChild(style);
 }
 if (!main.hasAttribute('data-aside-market-main')) main.setAttribute('data-aside-market-main','');
 if (!popup.hasAttribute('data-aside-market-popup')) popup.setAttribute('data-aside-market-popup','');
 const top = Math.max(0, Math.round(main.getBoundingClientRect().top));
 const topValue = top + 'px';
 if (document.documentElement.style.getPropertyValue('--aside-market-top') !== topValue) document.documentElement.style.setProperty('--aside-market-top', topValue);
 if (!document.getElementById('aside-market-bar')) {
   const bar = document.createElement('div');bar.id='aside-market-bar';
   const title = document.createElement('span');title.textContent='코인 목록 · 자동 고정';
   const button=document.createElement('button');button.textContent='끄기';button.title='자동 고정을 끄려면 클릭. 다시 켜기는 확장 프로그램 메뉴에서 가능합니다.';
   button.addEventListener('click',()=>chrome.storage.local.set({leftMarketEnabled:false}));
   bar.append(title,button);document.body.appendChild(bar);
 }
}
function queue() {if(!queued){queued=true;setTimeout(sync,200);}}
chrome.storage.local.get({leftMarketEnabled:true},prefs=>{enabled=prefs.leftMarketEnabled;queue();});
chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes.leftMarketEnabled){enabled=changes.leftMarketEnabled.newValue!==false;queue();}});
new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('resize',queue,{passive:true});window.addEventListener('scroll',queue,{passive:true});
})();
