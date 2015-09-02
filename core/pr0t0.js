'use strict';

angular.module('pr0t0Setup', [])
      .value('pr0t0Options', {
            isBrowser: {
                  firefox: navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
                  chrome: navigator.userAgent.toLowerCase().indexOf('chrome') > -1,
                  safari: navigator.userAgent.toLowerCase().indexOf('safari') > -1 && navigator.userAgent.toLowerCase().indexOf('chrome') === -1,
                  ie: navigator.userAgent.toLowerCase().indexOf('msie') > -1
            },
            defaultFileDropHandler:
            /* TODO: Manage dropped files */
            function(file, insertAction) {
                  var reader = new FileReader();
                  if (file.type.substring(0, 5) === 'image') {
                        reader.onload = function() {
                              //TODO
                        };
                        reader.readAsDataURL(file);
                        return true;
                  }
                  return false;
            }
      });

(function() {
      // encapsulate all variables so they don't become global vars
      "Use Strict";
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Compatibility
      if (!String.prototype.trim) {
            String.prototype.trim = function() {
                  return this.replace(/^\s+|\s+$/g, '');
            };
      }
      angular.module("pr0t0Editor", ['ngSanitize', 'pr0t0Setup', 'dnd']) //This makes ngSanitize required REMOVED  'ui.sortable'
      .directive('pr0t0Editor', [ '$compile', '$timeout', 'pr0t0Options', 'LogicalInheritance', 'dnd', 'uuid', function($compile, $timeout, pr0t0Options, LogicalInheritance, dnd, uuid){
            return {
                  scope: {
                        'html': '=ngModel'
                  },
                  replace: false,
                  restrict: 'EA',
                  link: function(scope, element, attrs){
                        scope.files = [];
                        scope.newFile = function(args){
                              for (var i = scope.files.length - 1; i >= 0; i--) {
                                    if(scope.files[i].open){
                                          scope.files[i].open = false;
                                    }
                              };
                              scope.files.push(args);
                        };
                        scope.closeFile = function(file){
                              var index = scope.files.indexOf(file);
                              scope.files.splice(index, 1);
                        };
                        scope.saveFile = function(id){
                              // Save methods
                        };
                        window.testNew = scope.newFile;
                        if(!scope.html || scope.html.length === 0){
                              var newId = uuid.new();
                              scope.newFile({ id: newId, name: 'untitled', open: true });
                        }
                        // D & D bindings
                        if(!pr0t0Options.isBrowser.firefox){
                              element.bind('drop', dnd.drop);
                        } else {
                              element.bind('drop', function(e){
                                    e.preventDefault();
                                    e.stopPropagation();
                                    return false;
                              });
                        }
                        element.bind('dragover', dnd.dragover);
                        // Reference container ?
                        LogicalInheritance.setContainer(element);
                        scope.selectedIndex = 0;
                  },
                  template: '<md-content class="md-padding">' +
                                    '<md-tabs md-selected="selectedIndex" md-border-bottom>' +
                                          '<md-tab ng-repeat="file in files" label="{{file.name}}">' +
                                                '<div class="file.id" style="padding: 25px; text-align: center;">' +
                                                      '<div id="{{file.id}}" pr0t0-bind ng-model=file class="componentsContainer"></div>' +
                                                      '<br/>' +
                                                      '<md-button class="md-primary md-raised" ng-click="closeFile( file )" ng-disabled="files.length <= 1">Remove File</md-button>' +
                                                '</div>' +
                                          '</md-tab>' +
                                    '</md-tabs>' +
                              '</md-content>'
            }
      }]).directive('pr0t0Bind', ['$compile', '$timeout', 'LogicalInheritance', function($compile, $timeout, LogicalInheritance){
            return {
                  replace: true,
                  scope: {
                        'pr0t0Model': '=ngModel'
                  },
                  link: function(scope, element, attrs){
                        element.append('<ul as-sortable="dragControlListeners" ng-model="components"><li ng-repeat="cmp in components" pr0t0-components-reload as-sortable-item compile="cmp.content"></li></ul>');
                        scope.$on('update', function(data, delay){
                              if(!delay){
                                    delay = 0;
                              }
                              $timeout(function(){
                                    if(data){
                                          scope.components = data;
                                          // Update METHODS
                                    }
                              }, delay);
                        });
                        // Sortable controllers
                        scope.dragControlListeners = {
                            accept: function (sourceItemHandleScope, destSortableScope) {
                              return true;
                            },
                            dragEnd: function(){
                              if(tmp[0].parentElement){
                                    tmp[0].parentElement.removeChild(tmp[0]);
                              }
                            }
                        };
                        // List of components (typeof array)
                        scope.components = [];
                        scope.$watch('pr0t0Model', function(newVal, oldVal){
                              if(newVal && scope.components.length === 0){
                                    scope.components = LogicalInheritance.readContent(newVal);
                              }
                        });
                        // scope.$watch("components", updateString);
                        $compile(element.contents())(scope);
                  }
            }
      }]).directive('prot0ComponentsReload', ['$timeout', 'pr0t0Toolbars', function($timeout, toolbars){
            return {
                  link: function(scope, element, attrs){
                        scope.cmp.dom = element;
                        scope.$watch(function(){
                              return element[0].innerHTML;
                        }, function(newVal, oldVal){
                              if(newVal && newVal !== oldVal){
                                    scope.cmp.content = newVal;
                              }
                        });
                        var toolbars = toolbars.all();
                        function attachEvents(el){
                              if(toolbars.length > 0){
                                    angular.forEach(toolbars, function(tb){
                                          if(typeof tb.events === 'string'){
                                                angular.forEach(tb.events.split(','), function(ev){
                                                      var throttleVar = tb[ev + 'Throttle'] ? tb[ev + 'Throttle'] : 0;
                                                      el.bind(ev, _.throttle(tb.show, throttleVar));
                                                });
                                          }
                                          if(typeof tb.events === 'object'){
                                                angular.forEach(tb.events, function(ev){
                                                      var throttleVar = tb[ev + 'Throttle'] ? tb[ev + 'Throttle'] : 0;
                                                      el.bind(ev, _.throttle(tb.show, throttleVar));
                                                });
                                          }
                                          if(typeof tb.hideEvents === 'string'){
                                                angular.forEach(tb.hideEvents.split(','), function(ev){
                                                      var throttleVar = tb[ev + 'Throttle'] ? tb[ev + 'Throttle'] : 0;
                                                      el.bind(ev, _.throttle(tb.hide, throttleVar));
                                                });
                                          }
                                          if(typeof tb.hideEvents === 'object'){
                                                angular.forEach(tb.hideEvents, function(ev){
                                                      var throttleVar = tb[ev + 'Throttle'] ? tb[ev + 'Throttle'] : 0;
                                                      el.bind(ev, _.throttle(tb.hide, throttleVar));
                                                });
                                          }
                                    });
                              }
                        }
                        // Attach Events to the main container / Maybe future refining to have global and localized events going on?
                        attachEvents(element);
                        if (scope.$last) $timeout(function() {
                            scope.$emit('pr0t0ComponentsReload');
                        });
                  },
                  restrict: 'A'
            }
      }]).directive('compile', ['$compile', '$sce', function ($compile, $sce) {
            return function(scope, element, attrs) {
                var ensureCompileRunsOnce = scope.$watch(
                  function(scope) {
                    return scope.$eval(attrs.compile);
                  },
                  function(value) {
                    var content = $sce.trustAsHtml(value);
                    element.html(content);
                    $compile(element.contents())(scope);
                    ensureCompileRunsOnce();
                  }
              );
          };
      }]);
})();