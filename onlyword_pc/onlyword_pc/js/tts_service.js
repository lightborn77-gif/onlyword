
// Simple TTS service wrapper
(function(){
  let speaking=false;
  function cancel(){ try{ speechSynthesis.cancel(); }catch(e){} speaking=false; }
  function speak(text,opts){
    if(!text) return;
    cancel();
    const u=new SpeechSynthesisUtterance(text);
    if(opts && opts.rate) u.rate=opts.rate;
    u.onend=()=>{ speaking=false; };
    speaking=true;
    speechSynthesis.speak(u);
  }
  window.TTSService={ speak, cancel, isSpeaking:()=>speaking };
})();
