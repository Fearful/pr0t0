'use strict';
angular.module("pr0t0Editor").service('pr0t0Toolbars', ['$rootScope', '$compile', function($rootScope, $compile){
      var registerToolbars = [];
      var service = {};
      var Toolbar = function(name, opts){
            var tb = { name: name };
            angular.forEach(opts, function(value, key){
                  tb[key] = value;
            });
            if(tb.template){
                  tb.template = angular.element(tb.template);
                  if(tb.flow !== "static"){
                        $compile(tb.template)($rootScope);                        
                  }
            }
            return tb;
      }
      function searchToolbar(name){
            var toolbar = false;
            angular.forEach(registerToolbars, function(tb){
                  if(tb.name === name){
                        toolbar = tb;
                  }
            });
            if(toolbar){
                  return toolbar;
            } else {
                  return false;
            }
      };

      service.tb = function(string, opts){
            if(!string){
                  return 'You need a toolbar name';
            }
            var toolbar = searchToolbar(string);
            if(!toolbar){
                  var tb = new Toolbar(string, opts);
                  registerToolbars.push(tb);
                  return tb;
            } else if(!opts){
                  return toolbar;
            } else {
                  var index = _.findIndex(registerToolbars, toolbar);
                  registerToolbars[index] = angular.extend(toolbar, opts);
            }
      };

      service.isActive = function(){
            return _.find(registerToolbars, function(tb){ return tb.active });
      }

      service.show = function(string, e){
            if(!string){
                  return 'You need a toolbar name';
            }
            var tb = searchToolbar(string);
            if(!tb){
                  return 'Toolbar not found';
            } else {
                  if(typeof tb.show === 'function'){
                        tb.show(e);
                  } else {
                        return 'Toolbar has no show registered method';
                  }
            }
      }

      var Component = function(node){
            this.content = node.innerHTML;
            this.style = node.style;
            return this;
      }

      service.wrapComponent = function(orgComponent){
            var newComponent = angular.element('<div class=cmp><div class=toolbars></div><div class=contentContainer></div></div>');
            var optsContainer = angular.element('<table width="100%"><tbody></tbody></table>')[0];
            if(orgComponent.nodeName === "TR"){
                  optsContainer.children[0].appendChild(orgComponent);
                  newComponent[0].children[1].appendChild(optsContainer);
            } else {
                  newComponent[0].children[1].appendChild(orgComponent);
            }
            var staticToolbars = _.filter(registerToolbars, function(tb){ return tb.flow === 'static'; });
            _.each(staticToolbars, function(tb){
                  newComponent[0].children[0].appendChild(tb.template[0]);
            });
            var cmp = new Component(newComponent[0]);
            return cmp;
      }

      service.hide = function(string, e){
            if(!string){
                  return 'You need a toolbar name';
            }
            var tb = searchToolbar(string);
            if(!tb){
                  return 'Toolbar not found';
            } else {
                  if(typeof tb.hide === 'function'){
                        tb.hide(e);
                  } else {
                        return 'Toolbar has no hide registered method';
                  }
            }
      }

      service.all = function(){
            return registerToolbars;
      }

      service.hideAll = function(eventName){
            angular.forEach(registerToolbars, function(tb){
                  if(typeof tb.hide === 'function'){
                        tb.hide(eventName);
                  }
            })
      }

      service.forceHideAll = function(){
            angular.forEach(registerToolbars, function(tb){
                  if(typeof tb.forcedHiding === 'function'){
                        tb.forcedHiding();
                  }
            })
      }

      return service;
}]);