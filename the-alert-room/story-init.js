/* The Alert Room — SPA home template without legacy video playback logic. */
(function(){
  'use strict';
  const view=document.getElementById('view');
  if(!view)throw new Error('The Alert Room home mount is missing');
  const home=view.innerHTML;
  window.ARStory={
    home:()=>home,
    afterRender(){
      window.ARLiveMotion?.mount?.();
      const anchor=location.hash.split('/')[1];
      if(!['about','contact','contact-details'].includes(anchor)){
        // A real Home navigation returns to the first full-screen cinematic scene.
        if(!anchor || anchor==='home')requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'instant'}));
        return;
      }
      requestAnimationFrame(()=>{
        const el=document.getElementById(anchor);
        if(!el)return;
        el.scrollIntoView({block:'start'});
        el.tabIndex=-1;el.focus({preventScroll:true});
      });
    }
  };
})();