const $ = (selector) => document.querySelector(selector);
const storeKey = 'syllabus-flow-v1';
let items = JSON.parse(localStorage.getItem(storeKey) || '[]');
let editingId = null;
const templates = [
  {name:'Class 10 Mathematics', subtitle:'Algebra, geometry & statistics · 10 units', tags:'class 10 maths mathematics school', units:['Real Numbers','Polynomials','Pair of Linear Equations','Quadratic Equations','Arithmetic Progressions','Triangles','Coordinate Geometry','Trigonometry','Circles','Statistics & Probability']},
  {name:'Class 12 Physics', subtitle:'Core physics revision · 10 units', tags:'class 12 physics science cbse', units:['Electrostatics','Current Electricity','Magnetism','Electromagnetic Induction','Optics','Dual Nature of Matter','Atoms','Nuclei','Semiconductors','Practical Revision']},
  {name:'Class 12 Biology', subtitle:'Foundation biology plan · 10 units', tags:'class 12 biology science cbse', units:['Reproduction','Genetics','Evolution','Human Health','Biotechnology','Ecology','Organisms & Populations','Biology in Human Welfare','Microbes','Revision']},
  {name:'English Language', subtitle:'Writing, reading & communication · 8 units', tags:'english language literature writing school', units:['Grammar Foundations','Reading Comprehension','Vocabulary','Paragraph Writing','Essay Writing','Creative Writing','Public Speaking','Final Portfolio']},
  {name:'Python for Beginners', subtitle:'Programming fundamentals · 9 units', tags:'python coding programming computer science', units:['Setup & First Program','Variables & Data Types','Conditions','Loops','Functions','Lists & Dictionaries','Files','Errors & Debugging','Mini Project']},
  {name:'Web Development Basics', subtitle:'Build your first websites · 8 units', tags:'web development html css javascript coding', units:['How the Web Works','HTML Structure','CSS Styling','Responsive Design','JavaScript Basics','DOM Interaction','Accessibility','Publish a Project']},
  {name:'UPSC Foundation', subtitle:'General studies starter plan · 9 units', tags:'upsc civil services india general studies', units:['Indian History','Geography','Indian Polity','Economy','Environment','Science & Technology','Current Affairs','Ethics','Mock Revision']},
  {name:'IELTS Preparation', subtitle:'Four skills, one study plan · 8 units', tags:'ielts english exam speaking writing', units:['Test Overview','Listening','Reading','Writing Task 1','Writing Task 2','Speaking','Vocabulary','Practice Tests']},
  {name:'Class 1 Foundations', subtitle:'Early literacy & numeracy · 8 units', tags:'class 1 grade 1 primary school foundation', units:['Letters & Sounds','Reading Words','Handwriting','Numbers to 100','Addition','Subtraction','Shapes','Everyday Science']},
  {name:'Class 5 Mathematics', subtitle:'Primary maths progression · 9 units', tags:'class 5 grade 5 maths mathematics primary', units:['Whole Numbers','Fractions','Decimals','Measurement','Geometry','Perimeter & Area','Data Handling','Patterns','Revision']},
  {name:'Class 8 Science', subtitle:'Core middle-school science · 9 units', tags:'class 8 grade 8 science school', units:['Crop Production','Microorganisms','Materials','Force & Pressure','Friction','Sound','Cell Structure','Reproduction','Pollution']},
  {name:'Class 10 Science', subtitle:'Physics, chemistry & biology · 10 units', tags:'class 10 grade 10 science cbse', units:['Chemical Reactions','Acids Bases & Salts','Metals & Non-metals','Carbon Compounds','Life Processes','Control & Coordination','Light','Electricity','Magnetism','Environment']},
  {name:'Class 12 Chemistry', subtitle:'Senior secondary chemistry · 10 units', tags:'class 12 chemistry science cbse', units:['Solutions','Electrochemistry','Chemical Kinetics','d and f Block','Coordination Compounds','Haloalkanes','Alcohols & Ethers','Aldehydes & Ketones','Amines','Biomolecules']},
  {name:'Class 12 Mathematics', subtitle:'Senior secondary mathematics · 10 units', tags:'class 12 maths mathematics cbse', units:['Relations & Functions','Inverse Trigonometry','Matrices','Determinants','Continuity','Differentiation','Integrals','Differential Equations','Vectors','Probability']},
  {name:'Computer Science Foundations', subtitle:'Thinking like a programmer · 9 units', tags:'computer science coding algorithms programming', units:['Computational Thinking','Data Representation','Networks','Algorithms','Programming Basics','Databases','Cyber Safety','Ethics','Project']},
  {name:'Data Science Basics', subtitle:'Analysis and visualization · 8 units', tags:'data science statistics python analytics', units:['Data Questions','Spreadsheets','Data Types','Descriptive Statistics','Data Visualization','Python Analysis','Data Ethics','Portfolio Project']},
  {name:'JavaScript Essentials', subtitle:'Interactive web programming · 9 units', tags:'javascript coding programming web', units:['Syntax & Variables','Functions','Arrays','Objects','DOM','Events','Async JavaScript','Modules','Project']},
  {name:'UI/UX Design Basics', subtitle:'Design thoughtful interfaces · 8 units', tags:'ui ux design product figma', units:['Design Thinking','User Research','Information Architecture','Wireframes','Visual Hierarchy','Prototyping','Usability Testing','Case Study']},
  {name:'Financial Literacy', subtitle:'Money skills for life · 8 units', tags:'finance money accounting economics business', units:['Budgeting','Saving','Banking','Interest','Credit','Insurance','Investing Basics','Financial Goals']},
  {name:'Economics Fundamentals', subtitle:'Micro and macro foundations · 9 units', tags:'economics business finance school', units:['Scarcity & Choice','Demand','Supply','Markets','National Income','Inflation','Unemployment','Government Policy','Global Trade']},
  {name:'History: Modern World', subtitle:'Key events and ideas · 8 units', tags:'history social studies world modern', units:['Enlightenment','Revolutions','Industrialisation','Colonialism','World War I','World War II','Decolonisation','Contemporary World']},
  {name:'Geography Essentials', subtitle:'People, places & planet · 8 units', tags:'geography social studies environment', units:['Maps & Scale','Landforms','Climate','Natural Resources','Population','Settlements','Agriculture','Sustainability']},
  {name:'Hindi Language', subtitle:'Reading, grammar & writing · 8 units', tags:'hindi language literature writing', units:['वर्ण और शब्द','व्याकरण','पठन','शब्दावली','अनुच्छेद लेखन','पत्र लेखन','रचनात्मक लेखन','पुनरावृत्ति']},
  {name:'Spoken English', subtitle:'Daily communication practice · 8 units', tags:'spoken english communication language', units:['Introductions','Everyday Vocabulary','Sentence Patterns','Listening','Pronunciation','Conversations','Presentations','Confidence Practice']},
  {name:'NEET Foundation', subtitle:'Medical entrance starter plan · 9 units', tags:'neet medical biology chemistry physics india', units:['Biology Foundations','Physics Foundations','Chemistry Foundations','Human Physiology','Genetics','Organic Chemistry','Mechanics','Mock Tests','Revision']},
  {name:'JEE Foundation', subtitle:'Engineering entrance starter plan · 9 units', tags:'jee engineering maths physics chemistry india', units:['Maths Foundations','Mechanics','Electrostatics','Physical Chemistry','Organic Chemistry','Algebra','Calculus','Mock Tests','Revision']}
];

function save() { localStorage.setItem(storeKey, JSON.stringify(items)); render(); }
function percent(item) { return item.units.length ? Math.round(item.units.filter(u => u.done).length / item.units.length * 100) : 0; }
function overall() { const units = items.flatMap(i => i.units); return units.length ? Math.round(units.filter(u => u.done).length / units.length * 100) : 0; }
function render() {
  const list = $('#syllabusList'); list.innerHTML = '';
  $('#emptyState').hidden = items.length > 0;
  $('#syllabusCount').textContent = `${items.length} ${items.length === 1 ? 'item' : 'items'}`;
  const complete = overall(); $('#overallProgress').textContent = `${complete}%`; $('#progressRing').style.background = `conic-gradient(var(--accent) ${complete * 3.6}deg, rgba(255,255,255,.12) 0deg)`;
  $('#progressHeadline').textContent = items.length ? (complete === 100 ? 'Everything is complete.' : 'Keep your momentum.') : 'Ready when you are.';
  $('#progressCopy').textContent = items.length ? `${items.flatMap(i => i.units).filter(u => u.done).length} units complete across ${items.length} syllabus${items.length === 1 ? '' : 'es'}.` : 'Add your first syllabus to begin.';
  items.forEach((item, index) => {
    const card = $('#syllabusTemplate').content.firstElementChild.cloneNode(true); const p = percent(item);
    card.querySelector('.course-index').textContent = String(index + 1).padStart(2, '0'); card.querySelector('h3').textContent = item.name; card.querySelector('.course-heading p').textContent = item.subtitle || 'No description yet'; card.querySelector('.track i').style.width = `${p}%`; card.querySelector('.course-progress strong').textContent = `${p}%`;
    const unitList = card.querySelector('.unit-list');
    item.units.forEach((unit, unitIndex) => { const row = document.createElement('label'); row.className = 'unit'; row.innerHTML = `<input type="checkbox" ${unit.done ? 'checked' : ''}><span></span><button class="remove-unit" aria-label="Remove unit">×</button>`; row.querySelector('span').textContent = unit.name; row.querySelector('input').onchange = () => { unit.done = !unit.done; save(); }; row.querySelector('.remove-unit').onclick = (e) => { e.preventDefault(); item.units.splice(unitIndex, 1); save(); }; unitList.append(row); });
    card.querySelector('.rename-card').onclick = () => openEditor(item.id); card.querySelector('.delete-card').onclick = () => { if (confirm(`Delete “${item.name}”?`)) { items = items.filter(x => x.id !== item.id); save(); } };
    if (item.source?.offlinePath) { const read = card.querySelector('.read-source'); read.hidden = false; read.onclick = () => openReader(item); }
    card.querySelector('.add-unit').onclick = () => { const name = prompt('Name this unit:'); if (name?.trim()) { item.units.push({name:name.trim(), done:false}); save(); } };
    list.append(card);
  });
}
function openEditor(id = null) { editingId = id; const item = items.find(x => x.id === id); $('#formKicker').textContent = item ? 'EDIT SYLLABUS' : 'NEW SYLLABUS'; $('#formTitle').textContent = item ? 'Refine your plan' : 'Build your plan'; $('#courseName').value = item?.name || ''; $('#courseSubtitle').value = item?.subtitle || ''; $('#courseUnits').value = item ? item.units.map(u => u.name).join('\n') : ''; $('#syllabusDialog').showModal(); $('#courseName').focus(); }
function toggleTheme() { const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'; document.documentElement.dataset.theme = next; localStorage.setItem('syllabus-flow-theme', next); }
$('#addSyllabus').onclick = () => openEditor(); $('#emptyAdd').onclick = () => openEditor(); $('#navAdd').onclick = () => openEditor(); $('#themeToggle').onclick = toggleTheme; $('#navTheme').onclick = toggleTheme;
function openLibrary() { $('#searchQuery').value = ''; renderTemplates(); $('#searchDialog').showModal(); showLibraryPanel('offline'); $('#searchQuery').focus(); }
function renderTemplates() {
  const query = $('#searchQuery').value.trim().toLowerCase();
  const match = templates.filter(t => !query || `${t.name} ${t.subtitle} ${t.tags}`.toLowerCase().includes(query));
  const result = $('#templateResults'); result.innerHTML = '';
  if (!match.length) { result.innerHTML = '<p class="no-results">No included plan matches that search. Create a custom syllabus instead.</p>'; return; }
  match.forEach(template => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'template-result';
    button.innerHTML = `<strong>${template.name}</strong><span>${template.subtitle}</span><div class="hint">Tap to add this plan</div>`;
    button.onclick = () => { items.push({id:crypto.randomUUID(),name:template.name,subtitle:template.subtitle,units:template.units.map(name => ({name,done:false}))}); $('#searchDialog').close(); save(); };
    result.append(button);
  });
}
$('#openSearch').onclick = openLibrary; $('#navSearch').onclick = openLibrary; $('#searchQuery').oninput = renderTemplates;
function showLibraryPanel(panel) { const online = panel === 'online'; $('#offlinePanel').hidden = online; $('#onlinePanel').hidden = !online; $('#offlineTab').classList.toggle('active', !online); $('#offlineTab').setAttribute('aria-selected', String(!online)); $('#onlineTab').classList.toggle('active', online); $('#onlineTab').setAttribute('aria-selected', String(online)); if (online) $('#webSearchQuery').focus(); }
$('#offlineTab').onclick = () => showLibraryPanel('offline'); $('#onlineTab').onclick = () => showLibraryPanel('online');
function safeDomain(url) { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return 'web source'; } }
function setWebStatus(message, error = false) { const status = $('#webSearchStatus'); status.textContent = message; status.classList.toggle('error', error); }
async function searchWeb() {
  const query = $('#webSearchQuery').value.trim(); if (!query) return;
  if (!navigator.onLine) { setWebStatus('You are offline. Saved syllabuses are still available.', true); return; }
  const button = $('#webSearchButton'); button.disabled = true; button.textContent = 'Searching…'; setWebStatus('Searching the web…'); $('#webSearchResults').innerHTML = '';
  try {
    const response = await fetch('/api/tavily-search', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({query})});
    const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Search is unavailable.');
    renderWebResults(data.results || [], query); setWebStatus(data.results?.length ? `${data.results.length} results. Download one to save it offline.` : 'No matching results. Try adding a board, school, or year.');
  } catch (error) { setWebStatus(error.message || 'Could not search right now.', true); } finally { button.disabled = false; button.textContent = 'Search online'; }
}
function renderWebResults(results, query) { const container = $('#webSearchResults'); container.innerHTML = ''; results.forEach(result => { const card = document.createElement('article'); card.className = 'template-result'; card.innerHTML = `<strong></strong><span></span><div class="hint"></div><button type="button" class="download-result">Download for offline</button>`; card.querySelector('strong').textContent = result.title || 'Untitled syllabus'; card.querySelector('span').textContent = result.content || safeDomain(result.url); card.querySelector('.hint').textContent = safeDomain(result.url); card.querySelector('.download-result').onclick = () => downloadSyllabus(result, query, card); container.append(card); }); }
async function downloadSyllabus(result, query, card) {
  const button = card.querySelector('.download-result'); button.disabled = true; button.textContent = 'Downloading…'; setWebStatus('Saving the syllabus to this device…');
  try {
    const response = await fetch('/api/tavily-extract', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({url:result.url, query})});
    const data = await response.json(); if (!response.ok) throw new Error(data.error || 'This source could not be downloaded.');
    if (!data.content) throw new Error('This source did not return readable syllabus text.');
    const id = crypto.randomUUID(); const offlinePath = `/offline-syllabuses/${id}.txt`;
    await caches.open('syllabus-flow-downloads-v1').then(cache => cache.put(offlinePath, new Response(data.content, {headers:{'Content-Type':'text/plain; charset=utf-8'}})));
    items.push({id, name:data.title || result.title || 'Downloaded syllabus', subtitle:`Saved from ${safeDomain(result.url)}`, units:[{name:'Read saved syllabus',done:false},{name:'Add your study units',done:false}], source:{url:result.url,offlinePath,savedAt:new Date().toLocaleDateString()}});
    $('#searchDialog').close(); save(); setWebStatus('Saved for offline.');
  } catch (error) { setWebStatus(error.message || 'Could not download this syllabus.', true); button.disabled = false; button.textContent = 'Download for offline'; }
}
async function openReader(item) { $('#readerTitle').textContent = item.name; $('#readerMeta').textContent = `${item.source.savedAt || 'Saved'} · ${item.source.url}`; $('#readerContent').textContent = 'Opening saved syllabus…'; $('#readerDialog').showModal(); try { const response = await caches.match(item.source.offlinePath); if (!response) throw new Error('The offline copy is no longer available.'); $('#readerContent').textContent = await response.text(); } catch (error) { $('#readerContent').textContent = error.message; } }
$('#webSearchButton').onclick = searchWeb; $('#webSearchQuery').addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); searchWeb(); } });
$('#syllabusForm').addEventListener('submit', (e) => { e.preventDefault(); const data = new FormData(e.currentTarget); const name = data.get('courseName').trim(); const units = data.get('courseUnits').split('\n').map(name => name.trim()).filter(Boolean); if (editingId) { const item = items.find(x => x.id === editingId); item.name = name; item.subtitle = data.get('courseSubtitle').trim(); const oldDone = new Map(item.units.map(u => [u.name, u.done])); item.units = units.map(name => ({name, done:oldDone.get(name) || false})); } else { items.push({id: crypto.randomUUID(), name, subtitle:data.get('courseSubtitle').trim(), units:units.map(name => ({name,done:false}))}); } $('#syllabusDialog').close(); save(); });
document.documentElement.dataset.theme = localStorage.getItem('syllabus-flow-theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'); render();
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'));
let deferredInstall = null;
window.addEventListener('beforeinstallprompt', (event) => { event.preventDefault(); deferredInstall = event; $('#installApp').hidden = false; });
$('#installApp').onclick = async () => { if (!deferredInstall) return; deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; $('#installApp').hidden = true; };
