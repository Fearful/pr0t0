'use strict';
window.ondragstart = function(e) { if(!e.target.attributes || e.dataTransfer.getData('Text').indexOf('.html') === -1){ return false; }; return true; };
// Declare app level module which depends on filters, and services
angular.module('pr0t0', [
      'jm.i18next',
      'ngAnimate',
      'pr0t0Editor'
])
// .run(['$rootScope', '$http', function(rootScope, http){
//   //Load available list of components
//   //Load current proyect / components selected
// }]);

// Multi-language configuration
angular.module('jm.i18next').config(['$i18nextProvider', 
  function($i18nextProvider) {
   $i18nextProvider.options = {
          lng: 'es',
          useCookie: false,
          useLocalStorage: false,
          fallbackLng: 'en',
          resGetPath: 'languages/__lng__/__ns__.json',
          defaultLoadingValue: 'loading'
    };
  }
]);
