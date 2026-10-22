/* InfoAll Live Weather — Open-Meteo live data, no API key required for typical personal/non-commercial use.
   Attribution: https://open-meteo.com/ */
(() => {
  "use strict";
  const $ = (s, root=document) => root.querySelector(s);
  const els = {
    input: $("#cityInput"), search: $("#searchButton"), locate: $("#locationButton"),
    refresh: $("#refreshButton"), status: $("#statusMessage"), content: $("#weatherContent"),
    suggestions: $("#suggestions"), theme: $("#themeToggle"), menu: $("#menuToggle"),
    mobileNav: $("#mobileNav"), toast: $("#toast")
  };
  const state = { place: null, weather: null, unit: localStorage.getItem("infoall-weather-unit") || "C", lastQuery: "Trichy", toastTimer: null, searchTimer: null };
  const weatherMap = {
    0:["Clear sky","☀️"],1:["Mainly clear","🌤️"],2:["Partly cloudy","⛅"],3:["Overcast","☁️"],
    45:["Fog","🌫️"],48:["Depositing rime fog","🌫️"],51:["Light drizzle","🌦️"],53:["Drizzle","🌦️"],55:["Dense drizzle","🌧️"],
    56:["Freezing drizzle","🌧️"],57:["Dense freezing drizzle","🌧️"],61:["Slight rain","🌦️"],63:["Moderate rain","🌧️"],65:["Heavy rain","🌧️"],
    66:["Freezing rain","🌧️"],67:["Heavy freezing rain","🌧️"],71:["Slight snow","🌨️"],73:["Moderate snow","🌨️"],75:["Heavy snow","❄️"],
    77:["Snow grains","🌨️"],80:["Rain showers","🌦️"],81:["Moderate showers","🌧️"],82:["Violent showers","⛈️"],85:["Snow showers","🌨️"],86:["Heavy snow showers","❄️"],
 95:["Thunderstorm","⛈️"],96:["Thunderstorm with hail","⛈️"],99:["Severe thunderstorm","⛈️"]
  };
  function codeInfo(code){ return weatherMap[code] || ["Weather conditions","🌤️"]; }
  function safeText(value){ return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch])); }
  function celsius(value){ return state.unit === "C" ? Math.round(value) : Math.round(value*9/5+32); }
  function temp(value){ return `${celsius(value)}°`; }
  function wind(value){ return `${Math.round(value)} km/h`; }
  function timeLabel(iso, opts={hour:"numeric"}){ return new Date(iso).toLocaleString(undefined,opts); }
  function fullDate(iso){ return new Date(iso).toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"}); }
  function setStatus(message){ els.status.textContent = message; }
  function toast(message){ els.toast.textContent=message;els.toast.classList.add("show");clearTimeout(state.toastTimer);state.toastTimer=setTimeout(()=>els.toast.classList.remove("show"),2600); }
  async function getJSON(url){ const response=await fetch(url,{headers:{Accept:"application/json"}});if(!response.ok)throw new Error(`Weather service returned ${response.status}`);return response.json(); }
  async function geocode(query){
    const url=`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`;
    const data=await getJSON(url);return data.results||[];
  }
  async function loadPlace(place){
    state.place=place;state.lastQuery=place.name;els.input.value=place.name;els.suggestions.hidden=true;
    setStatus(`Loading current conditions for ${place.name}…`);els.content.innerHTML='<div class="skeleton hero-skeleton"></div><div class="skeleton-row"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div>';
    try{
      const params=new URLSearchParams({
        latitude:place.latitude,longitude:place.longitude,timezone:"auto",forecast_days:"7",
        current:"temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m",
        hourly:"temperature_2m,precipitation_probability,weather_code,relative_humidity_2m",
        daily:"weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max"
      });
      const data=await getJSON(`https://api.open-meteo.com/v1/forecast?${params}`);
      state.weather=data;render();setStatus(`Updated ${timeLabel(data.current.time,{hour:"numeric",minute:"2-digit"})} local time · Live forecast data`);
    }catch(error){
      console.error(error);setStatus("Weather data could not be loaded.");
      els.content.innerHTML=`<div class="error-card"><div style="font-size:42px">🌧️</div><h2>We couldn't reach the weather service</h2><p>Check your internet connection and try again. The weather service may be temporarily unavailable.</p><button class="retry-button" id="retryInline">Try again</button></div>`;
      $("#retryInline")?.addEventListener("click",()=>loadPlace(place));
    }
  }
  function render(){
    const p=state.place,w=state.weather,c=w.current,d=w.daily,h=w.hourly;
    const [condition,emoji]=codeInfo(c.weather_code);
    const country=[p.admin1,p.country].filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i).join(", ");
    const now=new Date(c.time).getTime();
    let hourIndices=h.time.map((t,i)=>({t,i})).filter(x=>new Date(x.t).getTime()>=now-60*60*1000).slice(0,8);
    const currentDate=new Date(c.time);
    const localNow=fullDate(c.time);
    const rainChance=(idx)=>h.precipitation_probability?.[idx] ?? 0;
    const unitButton=`<div class="unit-toggle" aria-label="Temperature units"><button data-unit="C" class="${state.unit==="C"?"selected":""}" aria-pressed="${state.unit==="C"}">°C</button><button data-unit="F" class="${state.unit==="F"?"selected":""}" aria-pressed="${state.unit==="F"}">°F</button></div>`;
    const metric=(icon,label,value,unit="")=>`<div class="metric"><div class="metric-label"><span>${icon}</span>${label}</div><div class="metric-value">${value} <small>${unit}</small></div></div>`;
    const hourly=hourIndices.map(({t,i})=>{const [desc,ico]=codeInfo(h.weather_code[i]);return `<article class="hour-card"><div class="hour-time">${i===hourIndices[0].i?"Now":timeLabel(t,{hour:"numeric"})}</div><div class="hour-icon" title="${safeText(desc)}">${ico}</div><div class="hour-temp">${temp(h.temperature_2m[i])}</div><div class="hour-rain">💧 ${rainChance(i)}%</div></article>`;}).join("");
    const days=d.time.map((date,i)=>{const [desc,ico]=codeInfo(d.weather_code[i]);return `<article class="day-card"><div class="day-name">${i===0?"Today":timeLabel(date,{weekday:"short"})}</div><div class="day-date">${timeLabel(date,{month:"short",day:"numeric"})}</div><div class="day-icon" title="${safeText(desc)}">${ico}</div><div class="day-condition">${safeText(desc)}</div><div class="day-temps"><span>${temp(d.temperature_2m_max[i])}</span><span>${temp(d.temperature_2m_min[i])}</span></div></article>`;}).join("");
    const sunrise=d.sunrise?.[0]?timeLabel(d.sunrise[0],{hour:"numeric",minute:"2-digit"}):"—";
    const sunset=d.sunset?.[0]?timeLabel(d.sunset[0],{hour:"numeric",minute:"2-digit"}):"—";
    const uv=d.uv_index_max?.[0]!=null?Math.round(d.uv_index_max[0]*10)/10:"—";
    const rain=d.precipitation_probability_max?.[0] ?? "—";
    els.content.innerHTML=`
      <section class="current-card">
        <div class="current-main"><div class="location-kicker">CURRENT CONDITIONS</div><h2 class="location-title">${safeText(p.name)}${p.country_code?`, ${safeText(p.country_code)}`:""}</h2><div class="date-line">${safeText(localNow)}${country?` · ${safeText(country)}`:""}</div>
          <div class="temp-row"><div class="weather-symbol" aria-hidden="true">${emoji}</div><div><div class="temperature">${celsius(c.temperature_2m)}<sup>°${state.unit}</sup></div><div class="condition">${safeText(condition)}</div><div class="feels">Feels like ${temp(c.apparent_temperature)}°${state.unit}</div></div></div>
        </div>
        <div class="current-side"><div class="metric-grid">
          ${metric("💧","Humidity",Math.round(c.relative_humidity_2m),"%")}
          ${metric("🌬️","Wind speed",Math.round(c.wind_speed_10m),"km/h")}
          ${metric("☁️","Cloud cover",Math.round(c.cloud_cover),"%")}
          ${metric("🌧️","Precipitation",Number(c.precipitation).toFixed(1),"mm")}
        </div></div>
      </section>
      <div class="section-heading"><div><h2>Next hours</h2><p>Plan your day around the changing conditions.</p></div>${unitButton}</div>
      <section class="hourly-strip" aria-label="Hourly forecast">${hourly}</section>
      <div class="section-heading"><div><h2>7-day forecast</h2><p>Daily high and low temperatures · weather outlook</p></div></div>
      <section class="forecast-grid" aria-label="Seven day forecast">${days}</section>
      <div class="section-heading"><div><h2>Today's outlook</h2><p>Useful details for your plans outdoors.</p></div></div>
      <section class="insight-grid">
        <article class="info-card"><div class="info-top"><span>UV INDEX</span><span class="info-icon">☀️</span></div><div class="info-value">${uv}</div><div class="info-desc">${uv==="—"?"UV information unavailable":Number(uv)<3?"Low exposure":Number(uv)<6?"Moderate exposure":Number(uv)<8?"High exposure":"Very high exposure"} · Consider sun protection when needed.</div></article>
        <article class="info-card"><div class="info-top"><span>RAIN CHANCE</span><span class="info-icon">🌧️</span></div><div class="info-value">${rain}%</div><div class="info-desc">Maximum forecast precipitation probability for today.</div></article>
        <article class="info-card"><div class="info-top"><span>SUNRISE / SUNSET</span><span class="info-icon">🌅</span></div><div class="info-value" style="font-size:20px">${sunrise} <span style="color:var(--muted)">/</span> ${sunset}</div><div class="info-desc">Local sunrise and sunset times for your selected destination.</div></article>
      </section>`;
    els.content.querySelectorAll("[data-unit]").forEach(btn=>btn.addEventListener("click",()=>{state.unit=btn.dataset.unit;localStorage.setItem("infoall-weather-unit",state.unit);render();}));
  }
  async function searchCity(){
    const q=els.input.value.trim();if(!q){toast("Enter a city or destination first.");els.input.focus();return;}
    setStatus(`Searching for ${q}…`);els.suggestions.hidden=true;
    try{const results=await geocode(q);if(!results.length){setStatus("No matching location found.");toast("Try another city name.");return;}if(results.length===1){await loadPlace(results[0]);return;}showSuggestions(results,true);}
    catch(error){console.error(error);setStatus("Location search failed. Check your connection.");toast("Could not search locations.");}
  }
  function showSuggestions(results,always=false){
    if(!results.length){els.suggestions.hidden=true;return;}
    els.suggestions.innerHTML=results.map((r,i)=>`<div class="suggestion" role="option" tabindex="0" data-index="${i}"><span>${safeText(r.name)}</span><small>${safeText([r.admin1,r.country].filter(Boolean).join(", "))}</small></div>`).join("");
    els.suggestions.hidden=false;
    els.suggestions.querySelectorAll(".suggestion").forEach((el)=>{const choose=()=>loadPlace(results[Number(el.dataset.index)]);el.addEventListener("click",choose);el.addEventListener("keydown",e=>{if(e.key==="Enter")choose();});});
  }
  async function locateMe(){
    if(!navigator.geolocation){toast("Location is not supported by this browser.");return;}
    setStatus("Requesting your location permission…");
    navigator.geolocation.getCurrentPosition(async pos=>{
      try{const {latitude,longitude}=pos.coords;const data=await getJSON(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en&format=json`).catch(()=>null);
        const place=data?.results?.[0]||{name:"Your location",latitude,longitude,country_code:""};
        place.latitude=latitude;place.longitude=longitude;await loadPlace(place);
      }catch(e){await loadPlace({name:"Your location",latitude:pos.coords.latitude,longitude:pos.coords.longitude});}
    },err=>{setStatus("Location permission was not granted.");toast(err.code===1?"Allow location access to use this feature.":"Unable to detect location. Search for a city instead.");},{enableHighAccuracy:false,timeout:10000,maximumAge:300000});
  }
  let suggestTimer;
  els.input.addEventListener("input",()=>{
    clearTimeout(suggestTimer);const q=els.input.value.trim();if(q.length<2){els.suggestions.hidden=true;return;}
    suggestTimer=setTimeout(async()=>{try{showSuggestions(await geocode(q));}catch(_){els.suggestions.hidden=true;}},320);
  });
  els.input.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();searchCity();}if(e.key==="Escape")els.suggestions.hidden=true;});
  document.addEventListener("click",e=>{if(!e.target.closest(".search-panel"))els.suggestions.hidden=true;});
  els.search.addEventListener("click",searchCity);els.locate.addEventListener("click",locateMe);els.refresh.addEventListener("click",()=>state.place?loadPlace(state.place):searchCity());
  els.theme.addEventListener("click",()=>{document.body.classList.toggle("light");localStorage.setItem("infoall-weather-theme",document.body.classList.contains("light")?"light":"dark");});
  els.menu.addEventListener("click",()=>{const open=els.mobileNav.classList.toggle("open");els.menu.setAttribute("aria-expanded",String(open));els.menu.textContent=open?"✕":"☰";});
  if(localStorage.getItem("infoall-weather-theme")==="light")document.body.classList.add("light");
  const defaults=[{name:"Trichy",latitude:10.7905,longitude:78.7047,country:"India",country_code:"IN"}];
  loadPlace(defaults[0]);
})();