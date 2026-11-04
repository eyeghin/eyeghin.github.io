(() => {
  'use strict';
  function home() {
    return `<div class="paper-home"><section class="paper-cover" aria-labelledby="paper-title">
      <div class="paper-copy"><p class="paper-kicker">Welcome, AML analyst</p>
      <h1 id="paper-title">Follow <br>the <em>money.</em></h1>
      <p class="paper-deck">Behind every alert is a trail. Trace fictional transactions and decide which evidence makes the case.</p>
      <a class="paper-enter" href="#workspace">Enter the investigation desk <span aria-hidden="true">↗</span></a></div>
      <figure class="paper-film"><video muted playsinline preload="auto" poster="./assets/paper-trail.jpg" aria-label="Animated opening: a watching eye, flying banknotes, and a red thread connecting evidence."><source src="./assets/paper-trail.mp4" type="video/mp4"></video>
      <figcaption><span>The Paper Trail <i>/ Opening film</i></span><button type="button" data-film-toggle>Play film</button></figcaption></figure>
      </section><nav class="paper-index" aria-label="Explore training"><a href="#learn">Study a pattern <span>↗</span></a><a href="#case/AR-3002">Open case AR-3002 <span>↗</span></a><a href="#qa">Review your work <span>↗</span></a></nav></div>`;
  }
  function afterRender() {
    const video = document.querySelector('.paper-film video');
    if (!video) return;
    const toggle = document.querySelector('[data-film-toggle]');
    function sync() {
      toggle.textContent = video.ended ? 'Replay film ↺' : video.paused ? 'Play film ▷' : 'Pause film Ⅱ';
    }
    video.addEventListener('play', () => { video.classList.remove('film-ended'); sync(); });
    video.addEventListener('pause', sync);
    video.addEventListener('ended', () => { video.classList.add('film-ended'); sync(); });
    toggle.addEventListener('click', () => {
      if (!video.paused) return video.pause();
      if (video.ended) video.currentTime = 0;
      video.play().catch(sync);
    });
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) video.play().catch(sync);
  }
  window.ARStory = { home, afterRender };
})();
