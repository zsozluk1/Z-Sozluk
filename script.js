const words = Array.isArray(window.Z_SOZLUK_KELIMELER) ? window.Z_SOZLUK_KELIMELER : [];
function norm(value) { return String(value || '').toLocaleLowerCase('tr-TR').normalize('NFC').trim(); }
function params() { return new URLSearchParams(window.location.search); }
function goSearch(query) { window.location.href = `sonuclar.html?q=${encodeURIComponent(query.trim())}`; }
function makeSearchForm() {
  const form = document.querySelector('#arama-formu');
  const input = document.querySelector('#arama');
  if (form && input) form.addEventListener('submit', event => { event.preventDefault(); if (input.value.trim()) goSearch(input.value); });
}
function renderResults() {
  const list = document.querySelector('#sonuc-listesi');
  if (!list) return;
  const query = params().get('q') || '';
  const title = document.querySelector('#sonuc-basligi');
  const count = document.querySelector('#sonuc-sayisi');
  const input = document.querySelector('#arama');
  if (input) input.value = query;
  if (title) title.textContent = query ? `“${query}” için sonuçlar` : 'Arama sonuçları';
  list.replaceChildren();
  const q = norm(query);
  const starts = words.filter(w => norm(w.kelime).startsWith(q));
  const contains = words.filter(w => !norm(w.kelime).startsWith(q) && norm(w.kelime).includes(q));
  const matches = q ? [...starts, ...contains] : [];
  if (count) count.textContent = matches.length ? `${matches.length} kelime bulundu. Açıklamasını görmek için bir kelime seç.` : 'Eşleşme bulunamadı.';
  if (!matches.length) {
    const empty = document.createElement('div'); empty.className = 'no-results';
    const strong = document.createElement('strong'); strong.textContent = q ? 'Bu aramayla eşleşen kelime bulunamadı.' : 'Henüz bir kelime aramadın.';
    const p = document.createElement('span'); p.textContent = 'Ana sayfaya dönüp farklı bir kelime veya kelimenin ilk harflerini deneyebilirsin.';
    empty.append(strong, p); list.appendChild(empty); return;
  }
  matches.forEach(word => {
    const link = document.createElement('a'); link.className = 'result-item';
    link.href = `kelime.html?word=${encodeURIComponent(word.kelime)}&q=${encodeURIComponent(query)}`;
    const info = document.createElement('span'); const name = document.createElement('strong'); name.textContent = word.kelime; info.appendChild(name);
    const snippet = document.createElement('small'); const text = (word.aciklama || '').replace(/\s+/g, ' '); snippet.textContent = text.length > 140 ? text.slice(0,137) + '…' : text; info.appendChild(snippet);
    const arrow = document.createElement('span'); arrow.className = 'result-arrow'; arrow.setAttribute('aria-hidden','true'); arrow.textContent = '→'; link.append(info, arrow); list.appendChild(link);
  });
}
function renderDetail() {
  const card = document.querySelector('#kelime-detayi'); if (!card) return;
  const wanted = norm(params().get('word'));
  const word = words.find(w => norm(w.kelime) === wanted);
  const query = params().get('q') || '';
  const back = document.querySelector('#sonuclara-don'); if (back) back.href = query ? `sonuclar.html?q=${encodeURIComponent(query)}` : 'index.html';
  card.replaceChildren();
  if (!word) { const h = document.createElement('h3'); h.textContent = 'Kelime bulunamadı'; const p = document.createElement('p'); p.textContent = 'Bu kelime sözlükte bulunamadı. Ana sayfadan yeniden arama yapabilirsin.'; card.append(h,p); return; }
  document.title = `${word.kelime} | Z Sözlük`;
  const top = document.createElement('div'); top.className = 'detail-top'; const wrap = document.createElement('div');
  const h = document.createElement('h1'); h.className = 'detail-title'; h.textContent = word.kelime; wrap.appendChild(h);
  const tag = document.createElement('span'); tag.className = 'detail-tag'; tag.textContent = 'Z SÖZLÜK MADDESİ'; wrap.appendChild(tag); top.appendChild(wrap); card.appendChild(top);
  const heading = document.createElement('h4'); heading.textContent = 'AÇIKLAMA'; card.appendChild(heading);
  const explanation = document.createElement('p'); explanation.textContent = word.aciklama || 'Bu madde için ayrı bir açıklama bulunmuyor.'; card.appendChild(explanation);
  if (word.ornek) { const eh = document.createElement('h4'); eh.textContent = 'ÖRNEK CÜMLE'; card.appendChild(eh); const ep = document.createElement('p'); ep.className = 'example-text'; ep.textContent = word.ornek; card.appendChild(ep); }
}
makeSearchForm(); renderResults(); renderDetail();
