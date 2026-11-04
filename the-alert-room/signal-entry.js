(() => {
  'use strict';
  const shots = [
    { start: 0, title: 'Fifteen payments.', detail: 'The first credit looks ordinary. Then fourteen more arrive.' },
    { start: 3.5, title: 'One account.', detail: 'The payments converge on Lantern Nights Co., an event organizer.' },
    { start: 7, title: 'Would you flag it?', detail: '$6,020 came in. Open the ledger and decide what the evidence supports.' }
  ];
  function home() {
    return `<section class="signal-hero" aria-label="Opening film for case AR-3002">
      <div class="signal-screen"><video class="signal-movie" muted playsinline preload="auto" poster="./assets/signal-flight.jpg" aria-label="A payment token spins over a city of accounts. The camera races along payment routes and rises above their common destination."><source src="./assets/signal-flight.mp4" type="video/mp4"></video></div>
      <div class="signal-copy"><p class="signal-label"><b></b> Fictional case AR-3002</p>
      <h1 id="signal-title">Fifteen payments.</h1>
      <p id="signal-detail">The first credit looks ordinary. Then fourteen more arrive.</p>
      <a class="signal-enter" href="#case/AR-3002">Investigate this alert <span aria-hidden="true">↗</span></a></div>
</section><nav class="signal-links" aria-label="Training resources"><a href="#workspace">Investigation workspace <span>↗</span></a><a href="#learn">Training academy <span>↗</span></a><a href="#qa">Quality review <span>↗</span></a></nav>`;
  }
  function afterRender() {
    const stage = document.querySelector('.signal-hero');
    if (!stage) return;
    const movie = stage.querySelector('video');
    const title = stage.querySelector('h1'), detail = stage.querySelector('#signal-detail');
    let active = 0;
    function update() {
      const time = movie.currentTime;
      const index = time < shots[1].start ? 0 : time < shots[2].start ? 1 : 2;
      if (active !== index) {
        active = index;
        title.textContent = shots[index].title;
        detail.textContent = shots[index].detail;
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
          title.animate([{opacity:.2, transform:'translateY(8px)'},{opacity:1, transform:'none'}],{duration:300});
        }
      }
    }
    function revealCase() {
      movie.pause();
      stage.classList.add('case-ready');
      title.textContent = shots[2].title;
      detail.textContent = shots[2].detail;
    }
    movie.addEventListener('timeupdate',update);
    movie.addEventListener('ended', revealCase);
    movie.addEventListener('error', revealCase);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealCase();
    } else {
      movie.muted = true;
      movie.autoplay = true;
      movie.play().catch(revealCase);
    }
  }
  window.ARStory = {home,afterRender};
})();
