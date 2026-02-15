
// Common render scheduler (rAF batch)
(function(){
  let scheduled=false;
  function scheduleRender(fn){
    if(scheduled) return;
    scheduled=true;
    requestAnimationFrame(()=>{
      scheduled=false;
      try{ fn && fn(); }catch(e){}
    });
  }
  window.RenderCommon={ scheduleRender };
})();
