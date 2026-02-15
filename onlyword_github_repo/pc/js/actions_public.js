
// Public actions mapping (thin wrappers)
window.startApp = () => App && App.dispatch && App.dispatch({type:'START'});
window.stopApp = () => App && App.dispatch && App.dispatch({type:'STOP'});
window.nextCard = () => App && App.dispatch && App.dispatch({type:'NEXT'});
window.prevCard = () => App && App.dispatch && App.dispatch({type:'PREV'});
window.toggleMem = () => App && App.dispatch && App.dispatch({type:'TOGGLE_MEM'});
