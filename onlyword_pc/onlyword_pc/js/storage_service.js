
// Storage service with debounce
(function(){
  let timer=null;
  function save(key,val){
    clearTimeout(timer);
    timer=setTimeout(()=>{
      try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){}
    },500);
  }
  function load(key,def){
    try{
      const v=localStorage.getItem(key);
      return v?JSON.parse(v):def;
    }catch(e){ return def; }
  }
  window.StorageService={ save, load };
})();
