angular.module("dnd").directive('pr0t0Draggable', ['$window', '$rootScope', 'uuid', 'dnd', 'msOptions',
            function($window, $rootScope, uuid, dnd, msOptions) {
                  return {
                        restrict: 'A',
                        scope: {},
                        link: function(scope, el, attrs) {
                              angular.element(el).attr("draggable", "true");
                              var obj = el.attr('ng-repeat').split(' ')[0];
                              var key = el.scope()[obj].file;
                              el.bind('dragstart', function(e) {
                                    e.currentTarget.style.backgroundColor = '#fff';
                                    e.dataTransfer.setData('Text', key);
                              });
                              if(msOptions.isBrowser.firefox){
                                    el.bind('dragend', function(e){
                                          dnd.drop(e);
                                    });
                                    return false;
                              }
                        }
                  }
            }
      ]);