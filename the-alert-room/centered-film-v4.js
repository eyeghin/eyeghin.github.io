/* The Alert Room — film controls v4.
 * Zero third-party API, no paid runtime. All controls work in the static SPA.
 */
(function(){
 'use strict';
 function skipFilm(button){
   const stage=button.closest('#ar-motion-stage');
   if(!stage)return;
   stage.classList.add('ar6-skipped');
   stage.dataset.ar3Ready='true';
   document.body.classList.remove('ar3-playing');
   const headline=stage.querySelector('#home-title');
   if(headline){
     headline.setAttribute('tabindex','-1');
     headline.focus({preventScroll:true});
   }
 }
 document.addEventListener('click',e=>{
   const button=e.target.closest?.('.ar6-skip');
   if(button)skipFilm(button);
 });
 document.addEventListener('keydown',e=>{
   if(e.key==='Escape' && document.querySelector('#ar-motion-stage .ar3-intro') &&
       !document.querySelector('#ar-motion-stage.ar6-skipped')){
     const skip=document.querySelector('#ar-motion-stage .ar6-skip');
     if(skip){skipFilm(skip);}
   }
 });
})();
