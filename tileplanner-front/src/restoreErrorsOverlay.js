'use strict';


class ClearOverlay{
     sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
     init() {
      document.querySelector('html').addEventListener('click',function (e){
       let errorModal= document.querySelector('#error');
       if(errorModal!=null){
        errorModal.setAttribute('class' ,"fadeOutUp animated errors");
       }
       

      });
        
    }
}
new ClearOverlay().init();