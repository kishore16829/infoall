(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const STORAGE_KEY = 'infoall-guide-saved-v1';
  const cards = $$('.guide-card');
  const searchInput = $('#guideSearch');
  const categoryButtons = $$('.category-chip');
  const sortSelect = $('#sortSelect');
  const grid = $('#guideGrid');
  const emptyState = $('#emptyState');
  const resultsCount = $('#resultsCount');
  const toast = $('#toast');
  const guideData = {
    munnar:{title:'Munnar, at your own pace',kicker:'KERALA · NATURE & OUTDOORS',intro:'Munnar rewards the traveller who leaves room to breathe. Think cool mornings, rolling tea estates, forest edges and viewpoints that are best enjoyed without rushing.',sections:[['A thoughtful way to spend your time',['Start early for mist and quieter viewpoints.','Choose a small number of nearby stops instead of zigzagging across the hills.','Ask permission before entering working tea estates or photographing workers.']],['Make it practical',['Carry a light layer and shoes with grip; hill weather can change.','Confirm safari, garden and attraction timings with official local sources.','Keep roads and wildlife areas clean, and avoid feeding animals.']]]},
    jaipur:{title:'Jaipur, a living history',kicker:'RAJASTHAN · CULTURE & HERITAGE',intro:'Jaipur is more than its famous façades. Give yourself time for craft workshops, market lanes, architectural details and the everyday rhythms that bring the Pink City to life.',sections:[['Look a little closer',['Visit major landmarks early where possible.','Explore markets respectfully and ask before photographing artisans.','Leave time for a quiet courtyard, local café or small museum.']],['Before you go',['Check current entry rules and opening times.','Dress comfortably for walking and sun exposure.','Agree on transport fares or use a clearly priced service.']]]},
    coast:{title:'A slower Tamil Nadu coast',kicker:'TAMIL NADU · COAST & LOCAL LIFE',intro:'A coastal journey is best measured in unhurried stops: a sunrise walk, a local meal, a historic shoreline and time to simply listen to the sea.',sections:[['Build a gentle route',['Group nearby beaches and heritage sites to reduce driving.','Try busy, freshly prepared food from well-regarded local vendors.','Respect temple customs and any photography restrictions.']],['Coastal common sense',['Check tide, weather and local swimming advice before entering the water.','Never ignore warning flags or restricted areas.','Bring water, sun protection and a reusable bag.']]]},
    himalaya:{title:'Your first mountain trail',kicker:'HIMALAYAS · NATURE & OUTDOORS',intro:'A good first trek is one that matches your fitness, season and experience. You do not need the toughest trail to earn a memorable mountain day.',sections:[['Choose wisely',['Use a reputable local guide for unfamiliar or remote routes.','Check altitude, weather, trail conditions and any permits before setting out.','Tell someone your route and expected return time.']],['Pack with care',['Bring layers, rain protection, water, snacks and a first-aid kit.','Start early and turn back if conditions worsen.','Carry waste back out and keep distance from wildlife.']]]},
    planning:{title:'Plan less. Experience more.',kicker:'TRIP PLANNING · THE ESSENTIALS',intro:'The best itinerary gives your trip shape without filling every hour. Build around what matters most, then leave enough room for rest and surprise.',sections:[['A simple planning rhythm',['Pick one or two priorities for each day.','Group stops by area and account for realistic travel time.','Keep a buffer for meals, rest and unexpected delays.']],['Before departure',['Confirm bookings directly with providers.','Save tickets, key addresses and offline maps.','Share your itinerary with someone you trust.']]]},
    food:{title:'Eat your way into a place',kicker:'FOOD · LOCAL LIFE',intro:'Food can tell you a lot about a place. Follow local recommendations, stay curious and be thoughtful about hygiene, allergies and cultural customs.',sections:[['Find good local flavours',['Look for busy places with high turnover and freshly cooked food.','Ask locals what a dish is called and how it is usually eaten.','Mention allergies clearly; do not assume every ingredient is known.']],['Eat thoughtfully',['Choose safe drinking water and use your judgement with raw foods.','Carry any essential medication you may need.','Be considerate when photographing vendors or customers.']]]},
    responsible:{title:'Leave a lighter footprint',kicker:'RESPONSIBLE TRAVEL · TRAVEL BETTER',intro:'Responsible travel is not about perfection. It is about making choices that respect local people, protect nature and help more of the benefits stay in the community.',sections:[['Small choices, real value',['Use refillable bottles where safe drinking water is available.','Choose locally owned businesses when it suits your needs.','Follow marked trails and never touch or feed wild animals.']],['Respect the place',['Learn a few local words and customs.','Ask consent before taking identifiable photos.','Avoid attractions that exploit people or wildlife.']]]},
    roadtrip:{title:'The weekend road-trip edit',kicker:'ROAD TRIPS · THE OPEN ROAD',intro:'A little preparation leaves more energy for the good parts: scenic stops, playlists, spontaneous detours and the freedom of the open road.',sections:[['Before you leave',['Check tyres, brakes, lights, fuel and required documents.','Plan a route with rest stops and share it with someone.','Check weather, road closures and local driving rules.']],['Make the drive better',['Rotate drivers where possible and take breaks when tired.','Keep water, basic first aid and a phone charger accessible.','Never use your phone while driving; pull over safely first.']]]}
  };
  let selectedCategory = 'all';
  let savedOnly = false;
  let toastTimer;
  let saved = readSaved();
  function readSaved(){ try { const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return new Set(Array.isArray(parsed) ? parsed : []); } catch { return new Set(); } }
  function persistSaved(){ try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...saved])); } catch {} }
  function notify(message){ toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2500); }
  function updateSaveUI(){
    $('#savedCount').textContent = saved.size;
    $$('[data-save]').forEach(btn => { const isSaved = saved.has(btn.dataset.save); btn.classList.toggle('saved', isSaved); btn.innerHTML = isSaved ? '♥' : '♡'; btn.setAttribute('aria-pressed', String(isSaved)); btn.setAttribute('aria-label', `${isSaved ? 'Remove saved' : 'Save'} ${btn.getAttribute('aria-label').replace(/^(Save|Remove saved) /,'')}`); });
    sortAndFilter();
  }
  function sortAndFilter(){
    const term = (searchInput.value || '').trim().toLowerCase();
    let visible = cards.filter(card => {
      const matchesTerm = `${card.dataset.title} ${card.dataset.location} ${card.dataset.tags} ${card.dataset.category}`.toLowerCase().includes(term);
      return matchesTerm && (selectedCategory === 'all' || card.dataset.category === selectedCategory) && (!savedOnly || saved.has(card.querySelector('[data-save]').dataset.save));
    });
    if(sortSelect.value === 'az') visible.sort((a,b)=>a.dataset.title.localeCompare(b.dataset.title));
    if(sortSelect.value === 'saved') visible.sort((a,b)=>Number(saved.has(b.querySelector('[data-save]').dataset.save))-Number(saved.has(a.querySelector('[data-save]').dataset.save)));
    cards.forEach(card => { card.hidden = !visible.includes(card); });
    visible.forEach(card => grid.appendChild(card));
    emptyState.hidden = visible.length > 0;
    grid.hidden = visible.length === 0;
    resultsCount.textContent = savedOnly ? `Showing ${visible.length} saved guide${visible.length===1?'':'s'}` : `Showing ${visible.length} curated guide${visible.length===1?'':'s'}`;
    $('#showSaved').innerHTML = savedOnly ? 'Show all guides <span>↗</span>' : 'View saved guides <span>♡</span>';
  }
  function setCategory(category){ selectedCategory = category; categoryButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.category === category)); sortAndFilter(); }
  categoryButtons.forEach(btn => btn.addEventListener('click', () => { savedOnly = false; setCategory(btn.dataset.category); }));
  searchInput.addEventListener('input', sortAndFilter);
  sortSelect.addEventListener('change', sortAndFilter);
  $('#resetFilters').addEventListener('click', resetFilters);
  $('#emptyReset').addEventListener('click', resetFilters);
  function resetFilters(){ searchInput.value=''; savedOnly=false; setCategory('all'); sortSelect.value='featured'; sortAndFilter(); }
  grid.addEventListener('click', event => {
    const saveButton = event.target.closest('[data-save]');
    if(saveButton){ const id = saveButton.dataset.save; if(saved.has(id)){saved.delete(id);notify('Removed from your saved guides.');}else{saved.add(id);notify('Guide saved for later.');} persistSaved(); updateSaveUI(); return; }
    const openButton = event.target.closest('[data-open]'); if(openButton) openGuide(openButton.dataset.open);
  });
  $('#savedToggle').addEventListener('click', () => { savedOnly = !savedOnly; selectedCategory='all'; categoryButtons.forEach(btn=>btn.classList.toggle('active',btn.dataset.category==='all')); sortAndFilter(); $('#explore').scrollIntoView({behavior:'smooth'}); if(savedOnly && !saved.size) notify('Save a guide with the ♡ button to see it here.'); });
  $('#showSaved').addEventListener('click', () => { savedOnly = !savedOnly; selectedCategory='all'; categoryButtons.forEach(btn=>btn.classList.toggle('active',btn.dataset.category==='all')); sortAndFilter(); if(savedOnly && !saved.size) notify('No saved guides yet — tap a heart on any guide.'); });
  const dialog = $('#guideDialog');
  function openGuide(id){
    const guide = guideData[id]; if(!guide) return;
    $('#dialogContent').innerHTML = `<div class="dialog-kicker">${guide.kicker}</div><h2>${guide.title}</h2><p>${guide.intro}</p>${guide.sections.map(section=>`<h3>${section[0]}</h3><ul>${section[1].map(item=>`<li>${item}</li>`).join('')}</ul>`).join('')}<p><strong>Travel note:</strong> This is general inspiration, not live local information. Check current official guidance before travelling.</p><button class="button button-dark" data-dialog-save="${id}">${saved.has(id)?'♥ Saved to your list':'♡ Save this guide'}</button>`;
    dialog.showModal();
  }
  $('#dialogClose').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close(); const save=event.target.closest('[data-dialog-save]');if(save){const id=save.dataset.dialogSave;if(saved.has(id)){saved.delete(id);notify('Removed from your saved guides.');}else{saved.add(id);notify('Guide saved for later.');}persistSaved();updateSaveUI();save.textContent=saved.has(id)?'♥ Saved to your list':'♡ Save this guide';}});
  $('#plannerForm').addEventListener('submit',event=>{
    event.preventDefault(); const destination=$('#destinationInput').value.trim(); if(!destination)return;
    const style=$('#travelStyle').value; const length=$('#tripLength').value; const styleIdeas={balanced:['Choose one signature experience and one neighbourhood to explore.','Mix a scenic stop, a cultural highlight and a relaxed local meal.','Keep one flexible block for an unexpected discovery.'],nature:['Start with a well-marked outdoor spot and check conditions before leaving.','Keep the middle of the day flexible for rest, food and changing weather.','Choose a viewpoint or gentle walk suited to your group.'],culture:['Start with a major heritage site, then explore nearby streets on foot.','Make time for a museum, craft stop or locally guided experience.','Learn a few local customs and confirm entry rules in advance.'],food:['Build a route around a market, local speciality and relaxed meal.','Ask trusted locals for neighbourhood favourites.','Keep time open for a café or snack stop you discover along the way.'],relaxed:['Plan just one main activity each day.','Leave generous time for slow meals and rest.','Choose nearby stops and skip anything that makes the day feel rushed.']};
    const plan=styleIdeas[style]||styleIdeas.balanced; const result=$('#plannerResult'); result.innerHTML=`<h3>Your ${length} outline for ${escapeHTML(destination)}</h3><ol>${plan.map(escapeHTML).map((item,i)=>`<li><strong>${['Start with a highlight','Leave room to explore','Keep it flexible'][i]}:</strong> ${item}</li>`).join('')}</ol><p class="result-note">Next step: check local weather, travel times, opening hours and availability. This outline is generated locally and does not use live destination data.</p><button type="button" class="button button-light" id="copyPlan">Copy trip outline ↗</button>`; result.hidden=false; result.scrollIntoView({behavior:'smooth',block:'nearest'});
    $('#copyPlan').addEventListener('click',async()=>{const text=`${destination} — ${length} trip outline\n${plan.map((item,i)=>`${i+1}. ${item}`).join('\n')}\nCheck local weather, travel times and opening hours before departure.`;try{await navigator.clipboard.writeText(text);notify('Trip outline copied.');}catch{const area=document.createElement('textarea');area.value=text;document.body.appendChild(area);area.select();const ok=document.execCommand('copy');area.remove();notify(ok?'Trip outline copied.':'Copy is not available in this browser.');}});
  });
  function escapeHTML(value){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
  $('#newsletterForm').addEventListener('submit',event=>{event.preventDefault();$('#newsletterMessage').textContent='Thanks for your interest! This demo does not send or store email addresses. Connect a mailing service to enable subscriptions.';$('#newsletterEmail').value='';notify('Thanks for your interest in InfoAll.');});
  const menuToggle=$('#menuToggle'), mainNav=$('#mainNav');
  menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')!=='true';menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');mainNav.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);});
  $$('#mainNav a').forEach(link=>link.addEventListener('click',()=>{menuToggle.setAttribute('aria-expanded','false');mainNav.classList.remove('open');document.body.classList.remove('menu-open');}));
  document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();searchInput.focus();$('#explore').scrollIntoView({behavior:'smooth'});}if(event.key==='Escape'&&mainNav.classList.contains('open')){menuToggle.setAttribute('aria-expanded','false');mainNav.classList.remove('open');document.body.classList.remove('menu-open');}});
  const backTop=$('#backTop');window.addEventListener('scroll',()=>backTop.classList.toggle('visible',window.scrollY>550),{passive:true});backTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target);}}),{threshold:.12});$$('.reveal').forEach(el=>observer.observe(el));}else $$('.reveal').forEach(el=>el.classList.add('revealed'));
  $('#year').textContent=new Date().getFullYear();
  document.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.style.background='#dce9e2';img.alt=img.alt+' (image unavailable)';},{once:true}));
  updateSaveUI();
})();
