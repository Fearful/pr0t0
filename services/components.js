'use strict';
angular.module("pr0t0Editor").service('pr0t0Components', ['$window', function($window){
      var service = {};
      var components = [];
      var registeredScope = false;
      var registeredName = false;
      service.add = function(arr){
            if(typeof arr !== 'object'){
                  return;
            }
            angular.forEach(arr, function(cp){
                  components.push(cp);
                  if(registeredScope){
                        if(registeredScope.$root[registeredName]){
                              registeredScope.$root[registeredName].push(cp)
                        }
                  }
            });
            return components;
      }
      service.list = function(scope, name){
            if(scope){
                  registeredScope = scope;
                  registeredName = name;
            }
            if(msConfig().mode){
                  var filteredComponents = [];
                  angular.forEach(components, function(cp){
                        if(cp.mode === msConfig().mode.name){
                              filteredComponents.push(cp);
                        }
                  })
                  return filteredComponents;
            }
            return [];
      }
      return service;
}]);