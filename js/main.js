(function(){
  "use strict";

  // Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Sticky header shrink
  var header = document.getElementById('site-header');
  var lastY = 0;
  window.addEventListener('scroll', function(){
    if(window.scrollY > 40){ header.classList.add('shrink'); }
    else{ header.classList.remove('shrink'); }
  }, { passive:true });

  // Mobile nav
  var burger = document.getElementById('burgerBtn');
  var mobileNav = document.getElementById('mobileNav');
  burger.addEventListener('click', function(){
    var isOpen = mobileNav.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  mobileNav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ mobileNav.classList.remove('open'); burger.setAttribute('aria-expanded','false'); });
  });

  // Scroll reveal (single orchestrated observer)
  var reveals = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function(el){ io.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add('in'); });
  }

  // Hero video: autoplay by itself (muted, as browsers require), with fallbacks
  var hv = document.getElementById('heroVideo');
  var vp = document.getElementById('vidPlay');
  var vs = document.getElementById('vidSound');
  if(hv){
    hv.muted = true; hv.defaultMuted = true; hv.loop = true;
    hv.setAttribute('muted',''); hv.setAttribute('playsinline',''); hv.setAttribute('webkit-playsinline','');
    var userPaused = false;
    function tryPlay(){
      if(userPaused || !hv.paused) return;
      var p = hv.play();
      if(p && p.catch){ p.catch(function(){}); }
    }
    hv.addEventListener('play', function(){ vp.textContent = 'Pause'; });
    hv.addEventListener('pause', function(){ vp.textContent = 'Play'; });
    ['loadeddata','canplay','canplaythrough'].forEach(function(ev){ hv.addEventListener(ev, tryPlay); });
    tryPlay();
    window.addEventListener('load', tryPlay);
    document.addEventListener('visibilitychange', function(){ if(!document.hidden) tryPlay(); });
    // If the browser still blocked it (e.g. battery saver), start on the first touch, click or scroll
    ['touchstart','pointerdown','click','keydown','scroll'].forEach(function(ev){
      window.addEventListener(ev, tryPlay, { once:true, passive:true });
    });
    // Keep it running whenever it is on screen
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if(e.isIntersecting){ tryPlay(); } });
      }, { threshold:0.25 }).observe(hv);
    }
    vp.addEventListener('click', function(){
      if(hv.paused){ userPaused = false; hv.play(); } else { userPaused = true; hv.pause(); }
    });
    vs.addEventListener('click', function(){
      hv.muted = !hv.muted;
      vs.textContent = hv.muted ? 'Sound on' : 'Sound off';
      if(hv.paused && !userPaused){ tryPlay(); }
    });
  }

  // Lookbook filters
  var filterBtns = document.querySelectorAll('.look-filter');
  var lookItems = document.querySelectorAll('.look-item');
  filterBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      var f = btn.getAttribute('data-filter');
      filterBtns.forEach(function(b){
        var on = (b === btn);
        b.classList.toggle('active', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      lookItems.forEach(function(item){
        var show = (f === 'all' || item.getAttribute('data-cat') === f);
        item.classList.toggle('hide', !show);
      });
    });
  });

  // Lightbox (with previous / next)
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCap = document.getElementById('lightboxCap');
  var lbList = [], lbIndex = 0;
  function showLb(i){
    lbIndex = (i + lbList.length) % lbList.length;
    var item = lbList[lbIndex], img = item.querySelector('img');
    lightboxImg.src = img.src; lightboxImg.alt = img.alt;
    lightboxCap.textContent = item.getAttribute('data-cap') || '';
  }
  function openLb(item){
    lbList = Array.prototype.filter.call(lookItems, function(el){ return !el.classList.contains('hide'); });
    showLb(lbList.indexOf(item));
    lightbox.classList.add('open');
  }
  function closeLb(){ lightbox.classList.remove('open'); }
  lookItems.forEach(function(item){
    item.addEventListener('click', function(){ openLb(item); });
    item.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openLb(item); } });
  });
  document.getElementById('lightboxClose').addEventListener('click', closeLb);
  document.getElementById('lightboxPrev').addEventListener('click', function(e){ e.stopPropagation(); showLb(lbIndex - 1); });
  document.getElementById('lightboxNext').addEventListener('click', function(e){ e.stopPropagation(); showLb(lbIndex + 1); });
  lightbox.addEventListener('click', function(e){ if(e.target === lightbox){ closeLb(); } });
  document.addEventListener('keydown', function(e){
    if(!lightbox.classList.contains('open')) return;
    if(e.key === 'Escape'){ closeLb(); }
    if(e.key === 'ArrowLeft'){ showLb(lbIndex - 1); }
    if(e.key === 'ArrowRight'){ showLb(lbIndex + 1); }
  });
  // swipe on phones
  var tx = null;
  lightbox.addEventListener('touchstart', function(e){ tx = e.touches[0].clientX; }, { passive:true });
  lightbox.addEventListener('touchend', function(e){
    if(tx === null) return;
    var dx = e.changedTouches[0].clientX - tx; tx = null;
    if(Math.abs(dx) > 50){ showLb(lbIndex + (dx < 0 ? 1 : -1)); }
  }, { passive:true });

  // Testimonials carousel
  var slides = document.querySelectorAll('.t-slide');
  var dots = document.querySelectorAll('.t-dots button');
  var current = 0;
  function showSlide(i){
    slides.forEach(function(s, idx){ s.classList.toggle('active', idx === i); });
    dots.forEach(function(d, idx){ d.classList.toggle('active', idx === i); });
    current = i;
  }
  dots.forEach(function(dot, idx){
    dot.addEventListener('click', function(){ showSlide(idx); resetAutoplay(); });
  });
  var autoplay;
  function resetAutoplay(){
    clearInterval(autoplay);
    autoplay = setInterval(function(){ showSlide((current + 1) % slides.length); }, 6000);
  }
  resetAutoplay();

  // Marquee duplication already handled in markup (doubled content)

  // Form validation
  var form = document.getElementById('bookingForm');
  var formMsg = document.getElementById('formMsg');
  function setError(id, msg){
    document.getElementById('err-' + id).textContent = msg || '';
  }
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var valid = true;

    var fname = document.getElementById('fname').value.trim();
    if(fname.length < 2){ setError('fname', 'Please enter your full name.'); valid = false; }
    else{ setError('fname', ''); }

    var fphone = document.getElementById('fphone').value.trim();
    var phoneDigits = fphone.replace(/\D/g, '');
    if(phoneDigits.length < 10){ setError('fphone', 'Please enter a valid phone number.'); valid = false; }
    else{ setError('fphone', ''); }

    var femail = document.getElementById('femail').value.trim();
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(femail);
    if(!emailOk){ setError('femail', 'Please enter a valid email address.'); valid = false; }
    else{ setError('femail', ''); }

    var fservice = document.getElementById('fservice').value;
    if(!fservice){ setError('fservice', 'Please select a service.'); valid = false; }
    else{ setError('fservice', ''); }

    if(!valid){
      formMsg.classList.remove('show');
      return;
    }

    formMsg.classList.add('show');
    form.reset();
    setTimeout(function(){ formMsg.classList.remove('show'); }, 6000);
  });

})();
