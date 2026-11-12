/* ==========================================================
   Jerry Luxury - website assistant + WhatsApp hand-off
   Edit the CONFIG block below to change contact details.
   ========================================================== */
(function(){
  'use strict';

  var CONFIG = {
    brand:    'Jerry Luxury',
    whatsapp: '2347010544829',            // owner's WhatsApp, international format, no + or spaces
    phone:    '0701 054 4829',
    email:    'ailemenjeremiahoyakhire@gmail.com',
    address:  '05 Transformer Road, Upper Mission Extension, Benin City, Edo State',
    hours:    'Monday to Saturday, 9am to 7pm'
  };

  function waLink(text){
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text);
  }

  /* ---------- icons ---------- */
  var ICON_WA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
  var ICON_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-5.4A8 8 0 1 1 21 12z"/><circle cx="8.5" cy="12" r=".6" fill="currentColor"/><circle cx="12" cy="12" r=".6" fill="currentColor"/><circle cx="15.5" cy="12" r=".6" fill="currentColor"/></svg>';
  var ICON_SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></svg>';

  /* ---------- DOM ---------- */
  function el(tag, cls, html){
    var n = document.createElement(tag);
    if(cls) n.className = cls;
    if(html) n.innerHTML = html;
    return n;
  }

  var root = el('div', 'jl');
  root.innerHTML =
    '<div class="jl-tip" id="jlTip" role="status">Need help choosing an outfit? Ask our assistant.<button type="button" aria-label="Dismiss">&times;</button></div>' +
    '<div class="jl-stack" id="jlStack">' +
      '<a class="jl-wa" id="jlWa" href="#" target="_blank" rel="noopener" aria-label="Chat with the owner on WhatsApp">' + ICON_WA + '<span>WhatsApp</span></a>' +
      '<button class="jl-fab" id="jlFab" type="button" aria-label="Open the Jerry Luxury assistant" aria-expanded="false">' + ICON_CHAT + '<span>Ask our assistant</span></button>' +
    '</div>' +
    '<div class="jl-panel" id="jlPanel" role="dialog" aria-label="Jerry Luxury assistant">' +
      '<div class="jl-head">' +
        '<div class="jl-avatar" aria-hidden="true">JL</div>' +
        '<div class="jl-title"><strong>Jerry Luxury Assistant</strong><span>Instant answers, owner on WhatsApp</span></div>' +
        '<a class="jl-head-btn wa" id="jlHeadWa" href="#" target="_blank" rel="noopener" aria-label="Chat with the owner on WhatsApp">' + ICON_WA + '</a>' +
        '<button class="jl-head-btn" id="jlClose" type="button" aria-label="Close assistant">&times;</button>' +
      '</div>' +
      '<div class="jl-msgs" id="jlMsgs" aria-live="polite"></div>' +
      '<div class="jl-chips" id="jlChips"></div>' +
      '<div class="jl-input">' +
        '<input id="jlInput" type="text" placeholder="Type your question..." autocomplete="off" aria-label="Type your message">' +
        '<button id="jlSend" type="button" aria-label="Send message">' + ICON_SEND + '</button>' +
      '</div>' +
      '<div class="jl-foot">Prefer a person? <a id="jlFootWa" href="#" target="_blank" rel="noopener">Chat with the owner on WhatsApp</a></div>' +
    '</div>';
  document.body.appendChild(root);

  var $ = function(id){ return document.getElementById(id); };
  var fab = $('jlFab'), panel = $('jlPanel'), msgs = $('jlMsgs'), chips = $('jlChips'),
      input = $('jlInput'), tip = $('jlTip'), stack = $('jlStack');

  var generalWa = waLink('Hello ' + CONFIG.brand + ', I found you on your website and I would like to ask a question.');
  ['jlWa','jlHeadWa','jlFootWa'].forEach(function(id){ $(id).href = generalWa; });

  /* ---------- open / close ---------- */
  var opened = false, greeted = false;
  function openPanel(){
    panel.classList.add('open');
    stack.style.display = 'none';
    tip.classList.remove('show');
    fab.setAttribute('aria-expanded','true');
    opened = true;
    if(!greeted){ greeted = true; greet(); }
    setTimeout(function(){ input.focus(); }, 60);
  }
  function closePanel(){
    panel.classList.remove('open');
    stack.style.display = '';
    fab.setAttribute('aria-expanded','false');
    fab.focus();
  }
  fab.addEventListener('click', openPanel);
  $('jlClose').addEventListener('click', closePanel);
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && panel.classList.contains('open')){ closePanel(); }
  });
  tip.addEventListener('click', function(e){
    if(e.target.tagName === 'BUTTON'){ tip.classList.remove('show'); tipDismissed = true; return; }
    openPanel();
  });
  var tipDismissed = false;
  setTimeout(function(){ if(!opened && !tipDismissed){ tip.classList.add('show'); } }, 6000);
  setTimeout(function(){ tip.classList.remove('show'); }, 18000);

  /* ---------- message helpers (all text via textContent: safe) ---------- */
  var queue = Promise.resolve();
  function scrollDown(){ msgs.scrollTop = msgs.scrollHeight; }

  function addUser(text){
    var m = el('div', 'jl-msg me'); m.textContent = text; msgs.appendChild(m); scrollDown();
  }
  function say(text, extra){
    queue = queue.then(function(){
      return new Promise(function(resolve){
        var t = el('div', 'jl-typing', '<i></i><i></i><i></i>');
        msgs.appendChild(t); scrollDown();
        setTimeout(function(){
          msgs.removeChild(t);
          if(text){ var m = el('div', 'jl-msg bot'); m.textContent = text; msgs.appendChild(m); }
          if(extra){ extra(); }
          scrollDown(); resolve();
        }, 380 + Math.min((text || '').length * 6, 650));
      });
    });
    return queue;
  }
  function cta(label, message){
    queue = queue.then(function(){
      var a = el('a', 'jl-cta', ICON_WA);
      a.href = waLink(message); a.target = '_blank'; a.rel = 'noopener';
      var s = document.createElement('span'); s.textContent = label; a.appendChild(s);
      msgs.appendChild(a); scrollDown();
    });
  }
  function setChips(list){
    queue = queue.then(function(){
      chips.innerHTML = '';
      list.forEach(function(c){
        var b = el('button', 'jl-chip' + (c.wa ? ' wa' : '')); b.type = 'button'; b.textContent = c.label;
        b.addEventListener('click', function(){ handle(c.say || c.label); });
        chips.appendChild(b);
      });
      scrollDown();
      setTimeout(scrollDown, 60);
    });
  }

  var MAIN_CHIPS = [
    {label:'Our services'}, {label:'Book a fitting'}, {label:'Prices'},
    {label:'Location and hours'}, {label:'Talk to the owner', wa:true}
  ];
  var AFTER_CHIPS = [
    {label:'Book a fitting'}, {label:'Prices'}, {label:'More questions', say:'What else can you help with?'},
    {label:'Talk to the owner', wa:true}
  ];

  /* ---------- knowledge ---------- */
  var KB = [
    { id:'human', keys:['owner','whatsapp','whats app','human','person','speak to','talk to','chat with','call me','real person','agent'],
      reply:function(){ return 'Of course. Tap the button below and you will be chatting with the owner on WhatsApp.'; }, wa:true },
    { id:'book', keys:['book','booking','appointment','fitting','measure','measurement','order','commission'],
      start:true },
    { id:'price', keys:['price','cost','how much','pricing','rate','quote','charge','budget','expensive','cheap','naira','pay','payment'],
      reply:function(){ return 'Prices depend on the style, fabric, embroidery and how soon you need the outfit, so the owner gives an exact quote for each piece.\n\nTell me what you want made, or message the owner on WhatsApp with a photo of the style you like and you will get a quote.'; }, wa:true },
    { id:'agbada', keys:['agbada'],
      reply:function(){ return 'Our agbada is a wide-sleeve gown with buba and sokoto, with hand embroidery on the chest and neckline. It is cut to your measurements and fitted before delivery.'; } },
    { id:'senator', keys:['senator'],
      reply:function(){ return 'Our senator sets are clean, structured two-piece outfits cut for a sharp shoulder, made in premium cashmere and cotton.'; } },
    { id:'native', keys:['native','kaftan','buba','sokoto','cap'],
      reply:function(){ return 'We make kaftan and buba sets for everyday and occasions, finished with a matching cap on request.'; } },
    { id:'suit', keys:['suit','corporate','shirt','trouser','office','blazer','tuxedo'],
      reply:function(){ return 'We tailor single and double-breasted suits, shirts and trousers, all built around your measurements.'; } },
    { id:'edo', keys:['edo','coral','regalia','chief','chieftaincy','traditional','beads','bead','red wrapper'],
      reply:function(){ return 'Our Edo traditional wear is a white native top with a red wrapper, coral-bead scarf and cap, styled for chieftaincy, weddings and cultural events.'; } },
    { id:'group', keys:['groomsmen','groom','wedding','aso ebi','asoebi','aso-ebi','party','group','matching','ceremony','burial','event'],
      reply:function(){ return 'We make matching outfits for groomsmen, weddings and ceremonies so colour and fit are identical across the whole group.\n\nFor a group order the owner will need the number of people and your event date. You can send those on WhatsApp.'; }, wa:true },
    { id:'rtw', keys:['ready to wear','ready-to-wear','ready made','readymade','in stock','available now','in-store','instore'],
      reply:function(){ return 'We keep a rotating collection of finished pieces in the studio that can be adjusted quickly. Message the owner on WhatsApp to ask what is available right now.'; }, wa:true },
    { id:'alter', keys:['alter','alteration','repair','resize','adjust','fix','tailor my','reduce','too big','too tight'],
      reply:function(){ return 'We resize, restyle and repair garments, including ones made by another tailor. You can walk in, or send a photo to the owner on WhatsApp.'; }, wa:true },
    { id:'services', keys:['service','services','what do you','what can you','products','offer','sell','collection','collections','styles','menswear','catalog','catalogue','what you make','what do you make'],
      reply:function(){ return 'We make menswear to your exact measurements:\n\n- Agbada\n- Senator wear\n- Native sets (kaftan and buba)\n- Suits and corporate wear\n- Groomsmen and party sets\n- Edo traditional wear\n\nWe also do ready-to-wear and alterations. Which one are you interested in?'; } },
    { id:'location', keys:['where','location','address','located','find you','directions','shop','studio','atelier','visit','come over','benin'],
      reply:function(){ return 'We are at ' + CONFIG.address + '.\n\nOpen ' + CONFIG.hours + '.'; } },
    { id:'hours', keys:['hours','open','opening','close','closing','time do you','what time','sunday','saturday','weekend'],
      reply:function(){ return 'We are open ' + CONFIG.hours + '.\n\nAddress: ' + CONFIG.address + '.'; } },
    { id:'contact', keys:['phone','number','call','email','mail','contact','reach'],
      reply:function(){ return 'You can reach us here:\n\nPhone and WhatsApp: ' + CONFIG.phone + '\nEmail: ' + CONFIG.email + '\n\nWhatsApp is the fastest way to get a reply.'; }, wa:true },
    { id:'process', keys:['process','how does it work','how it works','steps','procedure','how do i','what happens'],
      reply:function(){ return 'Here is how a commission works:\n\n1. Consultation about the occasion, fabric and budget\n2. Hand measurement\n3. Design and cutting, with a sketch shared for your approval\n4. One or two fittings\n5. Final finishing and delivery'; } },
    { id:'delivery', keys:['deliver','delivery','ship','shipping','lagos','abuja','outside','abroad','overseas','another city','port harcourt','send to'],
      reply:function(){ return 'Clients outside Benin City are welcome. We use a guided self-measurement process, and the owner will confirm delivery options and timing with you on WhatsApp.'; }, wa:true },
    { id:'time', keys:['how long','days','weeks','turnaround','deadline','urgent','rush','ready by','when will','duration','fast'],
      reply:function(){ return 'Timing depends on the outfit and how busy the studio is. Tell the owner your event date on WhatsApp and they will confirm whether it can be ready in time.'; }, wa:true },
    { id:'thanks', keys:['thank','thanks','thx','appreciate','nice one'],
      reply:function(){ return 'You are welcome. Is there anything else I can help with?'; } },
    { id:'bye', keys:['bye','goodbye','see you','later'],
      reply:function(){ return 'Thank you for visiting Jerry Luxury. Style wey dey speak, quality wey dey last. Message us on WhatsApp any time.'; }, wa:true },
    { id:'greet', keys:['hello','hi','hey','good morning','good afternoon','good evening','howdy','sup','how far','abeg','good day'],
      reply:function(){ return 'Hello, welcome to Jerry Luxury. I can answer questions about our outfits, prices, location and booking, or connect you to the owner on WhatsApp. What would you like to know?'; } }
  ];

  function norm(s){ return ' ' + s.toLowerCase().replace(/[^a-z0-9\s-]/g,' ').replace(/\s+/g,' ').trim() + ' '; }
  function match(text){
    var t = norm(text), best = null, bestScore = 0;
    KB.forEach(function(item){
      var score = 0;
      item.keys.forEach(function(k){
        var key = k.toLowerCase();
        var short = key.length <= 3;               // short words must match as whole words
        var hit = short ? t.indexOf(' ' + key + ' ') !== -1 : t.indexOf(key) !== -1;
        if(hit){ score += key.length > 5 ? 2 : 1; }
      });
      if(score > bestScore){ bestScore = score; best = item; }
    });
    return best;
  }

  /* ---------- booking flow (collects details, then hands off to WhatsApp) ---------- */
  var flow = null;
  function startBooking(){
    flow = { step:'name', data:{} };
    setChips([]);
    say('I will take a few quick details so the owner has everything ready when you message on WhatsApp. You can type "cancel" at any time.\n\nFirst, what is your name?');
  }
  function continueBooking(text){
    var t = text.trim();
    if(/^(cancel|stop|exit|quit|no thanks)$/i.test(t)){
      flow = null;
      say('No problem, I have cancelled that. Anything else I can help with?');
      setChips(MAIN_CHIPS);
      return;
    }
    if(flow.step === 'name'){
      if(t.length < 2){ say('Please type your name so the owner knows who to reply to.'); return; }
      flow.data.name = t.slice(0, 60);
      flow.step = 'item';
      say('Nice to meet you, ' + flow.data.name + '. What would you like us to make?');
      setChips([{label:'Agbada'},{label:'Senator wear'},{label:'Suit'},{label:'Native set'},{label:'Groomsmen outfits'},{label:'Edo traditional wear'}]);
      return;
    }
    if(flow.step === 'item'){
      flow.data.item = t.slice(0, 120);
      flow.step = 'date';
      say('Great choice. When do you need it by? Type a date, or "not sure".');
      setChips([{label:'Not sure'},{label:'Within 2 weeks'},{label:'Within a month'}]);
      return;
    }
    if(flow.step === 'date'){
      flow.data.date = t.slice(0, 60);
      var d = flow.data;
      flow = null;
      var message = 'Hello ' + CONFIG.brand + ', my name is ' + d.name + '.\n' +
                    'I would like to book a fitting.\n' +
                    'Outfit: ' + d.item + '\n' +
                    'Needed by: ' + d.date + '\n' +
                    '(Sent from your website assistant)';
      say('Thank you, ' + d.name + '. Your details are filled in already. Tap the button below to send them to the owner on WhatsApp and confirm a time.');
      cta('Send my request on WhatsApp', message);
      setChips([{label:'Our services'},{label:'Prices'},{label:'Location and hours'}]);
    }
  }

  /* ---------- conversation ---------- */
  function greet(){
    say('Hello, welcome to Jerry Luxury. I can answer questions about our outfits, prices, location and booking, or connect you straight to the owner on WhatsApp.\n\nWhat would you like to know?');
    setChips(MAIN_CHIPS);
  }

  function handle(text){
    text = (text || '').trim();
    if(!text) return;
    addUser(text);
    chips.innerHTML = '';
    input.value = '';

    if(flow){ continueBooking(text); return; }

    var item = match(text);
    if(!item){
      say('I may not have an exact answer to that, but the owner can help you directly. You can ask me about our services, prices, location, hours or booking, or message the owner on WhatsApp.');
      cta('Ask the owner on WhatsApp', 'Hello ' + CONFIG.brand + ', I have a question: ' + text);
      setChips(MAIN_CHIPS);
      return;
    }
    if(item.start){ startBooking(); return; }

    say(item.reply());
    if(item.wa){
      var msg = item.id === 'human'
        ? 'Hello ' + CONFIG.brand + ', I found you on your website and I would like to speak with you.'
        : 'Hello ' + CONFIG.brand + ', I was chatting on your website about: ' + text;
      cta('Chat with the owner on WhatsApp', msg);
    }
    setChips(item.id === 'greet' ? MAIN_CHIPS : AFTER_CHIPS);
  }

  $('jlSend').addEventListener('click', function(){ handle(input.value); });
  input.addEventListener('keydown', function(e){
    if(e.key === 'Enter'){ e.preventDefault(); handle(input.value); }
  });
})();
