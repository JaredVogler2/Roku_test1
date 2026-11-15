(() => {
'use strict';
const DECKS = window.SOFASPARK_DECKS;
if (!Array.isArray(DECKS) || DECKS.length !== 4 || DECKS.flat(2).length !== 432) {
  document.body.insertAdjacentHTML('afterbegin','<p role="alert">Game decks failed to load. Refresh to retry.</p>');
  return;
}
const MODES = [
  {name:'Act It Out',tag:'MAKE THEM GUESS',description:'Big gestures. Bigger laughs.',icon:'🎭',symbol:'✳',accent:'#ff799d',seconds:60,hint:'No talking. Just act it out!'},
  {name:'Pick A Side',tag:'CHOOSE YOUR ANSWER',description:'Wild questions. Strong opinions.',icon:'⚖',symbol:'↗',accent:'#a98cff',seconds:45,hint:'Everyone picks a side. Then explain why.'},
  {name:'Beat The Clock',tag:'THINK FAST',description:'Five seconds. Three answers.',icon:'⏱',symbol:'✦',accent:'#63e1bd',seconds:5,hint:'Name three before time runs out!'},
  {name:'Story Spark',tag:'MAKE IT UP',description:'Unexpected twists, epic tales.',icon:'✧',symbol:'✳',accent:'#ffc976',seconds:75,hint:'Tell the most creative story you can.'}
];
const PACKS = [
  {name:'Family Night',tag:'ALL AGES',description:'Wholesome chaos for the whole crew.',emoji:'🏠',color:'#ffc976'},
  {name:'Friends Night',tag:'THE WHOLE GANG',description:'Inside jokes not required. Laughing definitely is.',emoji:'🎉',color:'#ff799d'},
  {name:'Date Night',tag:'JUST THE TWO OF YOU',description:'A little flirty, a lot of fun.',emoji:'💗',color:'#9b83ff'}
];
const $ = id => document.getElementById(id);
const state = {view:'home',mode:0,pack:0,order:[],index:0,visited:0,scores:[0,0],seconds:0,running:false,timer:null,settings:{palette:'midnight',scale:100,format:'desktop'}};
try { const saved=JSON.parse(localStorage.getItem('sofaspark-web-settings')||'null'); if(saved) Object.assign(state.settings,saved); } catch (_) {}
function saveSettings(){try{localStorage.setItem('sofaspark-web-settings',JSON.stringify(state.settings));}catch(_){}}
function shuffle(n) { const a=Array.from({length:n},(_,i)=>i); for(let i=n-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function setView(view) {
  state.view=view;
  ['home','packs','play'].forEach(v=>$(v+'View').classList.toggle('hidden',v!==view));
  $('eyebrow').innerHTML='<span class="rule"></span> '+({home:'GAME NIGHT REINVENTED',packs:'GOOD COMPANY, BETTER STORIES',play:'THE FUN STARTS NOW'}[view]);
  const titles={
    home:'Good times start<br><em>right here.</em>',
    packs:'Find your<br><em>people.</em>',
    play:'Let the good<br><em>times roll.</em>'
  };
  $('pageTitle').innerHTML=titles[view];
  $('pageSubtitle').textContent={
    home:'Four games. Three ways to play. One really good night.',
    packs:MODES[state.mode].name+' · Choose a pack for your group.',
    play:MODES[state.mode].name+' · '+PACKS[state.pack].name+' · '+DECKS[state.mode][state.pack].length+' original cards.'
  }[view];
  if(view!=='play') stopTimer();
  document.title=(view==='home'?'SofaSpark Party':view==='packs'?'Choose your crowd':MODES[state.mode].name)+' • SofaSpark';
}
function drawModes(){
 $('modeGrid').replaceChildren();
 MODES.forEach((m,i)=>{
  const el=document.createElement('button');
  el.className='mode-card'+(i===state.mode?' selected':'');
  el.style.setProperty('--accent',m.accent);
  el.innerHTML='<span class="mode-number">0'+(i+1)+' / GAME</span><span class="mode-icon">'+m.icon+'</span><h3>'+m.name+'</h3><p>'+m.description+'</p><span class="mode-arrow">↗</span>';
  el.addEventListener('click',()=>selectMode(i));
  el.setAttribute('aria-label','Play '+m.name);
  $('modeGrid').append(el);
 });
}
function selectMode(i){state.mode=i;drawModes();drawPacks();setView('packs');}
function drawPacks(){
 $('currentGameLabel').textContent=MODES[state.mode].name.toUpperCase();
 $('packGrid').replaceChildren();
 PACKS.forEach((p,i)=>{
  const el=document.createElement('button');
  el.className='pack-card'+(i===state.pack?' selected':'');
  el.style.setProperty('--accent',p.color);
  el.innerHTML='<span class="pack-index">PACK 0'+(i+1)+' / 36 CARDS</span><span class="pack-emoji">'+p.emoji+'</span><h3>'+p.name+'</h3><p>'+p.description+'</p><span class="pack-bottom"><span>READY WHEN YOU ARE</span><span>START PLAYING ↗</span></span>';
  el.addEventListener('click',()=>startGame(i));
  el.setAttribute('aria-label','Start '+p.name);
  $('packGrid').append(el);
 });
}
function startGame(i){
 state.pack=i;state.order=shuffle(DECKS[state.mode][i].length);state.index=0;state.visited=0;state.scores=[0,0];
 $('playModeLabel').textContent=MODES[state.mode].name.toUpperCase();
 $('playPackLabel').textContent=PACKS[i].name.toUpperCase();
 setView('play');displayCard(true);window.scrollTo({top:0,behavior:'smooth'});
}
function displayCard(countAsPlayed){
 if(countAsPlayed)state.visited++;
 const mode=MODES[state.mode];
 const deck=DECKS[state.mode][state.pack];
 $('challengeTag').textContent='✦ '+mode.tag;
 $('cardCount').textContent='CARD '+String(state.index+1).padStart(2,'0')+' / '+deck.length;
 $('promptSymbol').textContent=mode.symbol;
 $('promptSymbol').style.color=mode.accent;
 $('promptText').textContent=deck[state.order[state.index]];
 $('gameHint').textContent=mode.hint;
 $('sessionCount').textContent=String(state.visited).padStart(3,'0')+' CHALLENGES PLAYED';
 $('promptCard').style.borderColor=mode.accent+'90';
 $('scoreA').textContent=state.scores[0];
 $('scoreB').textContent=state.scores[1];
 $('prevBtn').disabled=state.index===0;
 resetTimer();
}
function next(){
 if(state.view!=='play')return;
 state.index++;
 if(state.index===state.order.length){state.order=shuffle(DECKS[state.mode][state.pack].length);state.index=0;}
 displayCard(true);
}
function previous(){
 if(state.view!=='play'||state.index===0)return;
 state.index--;
 displayCard(false);
}
function stopTimer(){
 state.running=false;
 if(state.timer!==null){clearInterval(state.timer);state.timer=null;}
}
function updateTimer(){
 const s=state.seconds;
 const r=$('timerReadout');
 r.classList.toggle('expired',s===0);
 r.textContent=s===0?'TIME UP!':String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
 $('timerToggle').textContent=state.running?'Ⅱ Pause timer':s===0?'↻ Play again':'▶ Start timer';
 $('timerNote').textContent=state.running?'Go, go, go!':s===0?'Time is up — next challenge!':'Take your time to read first.';
}
function resetTimer(){
 stopTimer();
 state.seconds=MODES[state.mode].seconds;
 updateTimer();
}
function toggleTimer(){
 if(state.view!=='play')return;
 if(state.running){stopTimer();updateTimer();return;}
 if(state.seconds===0)state.seconds=MODES[state.mode].seconds;
 state.running=true;
 let previous=performance.now();
 state.timer=setInterval(()=>{
   const now=performance.now();
   const elapsed=Math.floor((now-previous)/1000);
   if(elapsed>0){state.seconds=Math.max(0,state.seconds-elapsed);previous+=elapsed*1000;updateTimer();}
   if(state.seconds===0)stopTimer();
 },100);
 updateTimer();
}
function award(team,delta){
 if(state.view!=='play')return;
 state.scores[team]=Math.max(0,state.scores[team]+delta);
 $('scoreA').textContent=state.scores[0];$('scoreB').textContent=state.scores[1];
}
function back(){if(state.view==='play'){setView('packs');drawPacks();}else if(state.view==='packs'){setView('home');drawModes();}}
function selectAdjacent(delta){
 if(state.view==='home'){state.mode=(state.mode+MODES.length+delta)%MODES.length;drawModes();}
 if(state.view==='packs'){state.pack=(state.pack+PACKS.length+delta)%PACKS.length;drawPacks();}
}
function keyHandler(e){
 if($('settingsDialog').open||$('helpDialog').open||['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))return;
 const key=e.key;
 if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' ','Enter','Escape','Backspace'].includes(key))e.preventDefault();
 if(key==='Escape'||key==='Backspace'){back();return;}
 if(key===' '){if(state.view==='play')toggleTimer();return;}
 if(key==='ArrowLeft'){if(state.view==='play')previous();else selectAdjacent(-1);return;}
 if(key==='ArrowRight'){if(state.view==='play')next();else selectAdjacent(1);return;}
 if(key==='ArrowUp'){award(0,1);return;}
 if(key==='ArrowDown'){award(1,1);return;}
 if(key==='Enter'){if(state.view==='home')selectMode(state.mode);else if(state.view==='packs')startGame(state.pack);else next();}
}
function applySettings(){
 const s=state.settings;
 if(!['midnight','citrus','ocean'].includes(s.palette))s.palette='midnight';
 s.scale=Math.min(130,Math.max(80,Number(s.scale)||100));
 if(!['mobile','desktop'].includes(s.format))s.format='desktop';
 document.body.dataset.palette=s.palette;
 document.body.classList.toggle('mobile-preview',s.format==='mobile');
 document.documentElement.style.setProperty('--textscale',s.scale/100);
 $('scale').value=s.scale;$('scaleValue').textContent=s.scale+'%';$('palette').value=s.palette;
 document.querySelectorAll('[data-format]').forEach(b=>b.classList.toggle('chosen',b.dataset.format===s.format));
}
function openDialog(id){$(id).showModal();}
document.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',()=>el.closest('dialog').close()));
$('settingsBtn').addEventListener('click',()=>openDialog('settingsDialog'));
$('helpBtn').addEventListener('click',()=>openDialog('helpDialog'));
$('palette').addEventListener('change',e=>{state.settings.palette=e.target.value;applySettings();saveSettings();});
$('scale').addEventListener('input',e=>{state.settings.scale=Number(e.target.value);applySettings();saveSettings();});
document.querySelectorAll('[data-format]').forEach(el=>el.addEventListener('click',()=>{state.settings.format=el.dataset.format;applySettings();saveSettings();}));
$('resetSettings').addEventListener('click',()=>{state.settings={palette:'midnight',scale:100,format:'desktop'};applySettings();saveSettings();});
$('backFromPacks').addEventListener('click',()=>setView('home'));
$('backFromGame').addEventListener('click',()=>{setView('packs');drawPacks();});
$('prevBtn').addEventListener('click',previous);$('nextBtn').addEventListener('click',next);
$('timerToggle').addEventListener('click',toggleTimer);$('timerReset').addEventListener('click',resetTimer);
$('resetScores').addEventListener('click',()=>{state.scores=[0,0];$('scoreA').textContent='0';$('scoreB').textContent='0';});
document.querySelectorAll('[data-team]').forEach(el=>el.addEventListener('click',()=>award(Number(el.dataset.team),el.classList.contains('score-plus')?1:-1)));
document.addEventListener('keydown',keyHandler);
window.addEventListener('pagehide',stopTimer);
applySettings();drawModes();drawPacks();setView('home');
window.SOFA_DEBUG={state,MODES,PACKS}; // Exposed solely for local automated smoke tests.
})();