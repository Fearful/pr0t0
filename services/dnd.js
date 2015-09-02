'use strict';
angular.module("dnd", []).factory('dnd', ['$templateCache', 'LogicalInheritance', function($templateCache, LogicalInheritance){
      var service = {};
      var indexToDrop = false;
      service.dragover = function(e){
            e.preventDefault();
            e.stopPropagation();
            indexToDrop = false;
            LogicalInheritance.hideSelection();
            var coords = { x: e.x ? e.x: e.clientX, y: e.y ? e.y : e.clientY },
                  pr0t0Container = e.currentTarget,
                  selectedComponent = false,
                  direction,
                  crosBrowserElement = (e.rangeParent || e.srcElement);
            if(crosBrowserElement.tagName === "UL"){
                  var currentComponents = LogicalInheritance.components(crosBrowserElement);
            } else {
                  var ref = crosBrowserElement;
                  while(ref && ref.tagName !== "UL"){
                        ref = ref.parentElement;
                  }
                  var currentComponents = LogicalInheritance.components(ref);
            }
            angular.forEach(currentComponents, function(comp){
                  if(comp){
                        var compPos = comp.dom[0].getBoundingClientRect();
                        // Before
                        if(compPos.top + (compPos.height / 2) > coords.y){
                              if(!selectedComponent || selectedComponent && (selectedComponent.dom[0].getBoundingClientRect().top > compPos.top)){
                                    direction = 'before';
                                    selectedComponent = comp;
                              }
                        }
                        // After
                        if(coords.y > compPos.bottom - (compPos.height / 2)){
                              if(!selectedComponent || selectedComponent && (selectedComponent.dom[0].getBoundingClientRect().bottom < compPos.bottom)){
                                    direction = 'after';
                                    selectedComponent = comp;
                              }
                        }
                  }
            });
            if(selectedComponent){
                  var index = _.findIndex(currentComponents, selectedComponent);
                  if(direction === 'before'){
                        if(!index && index > 0){
                              indexToDrop = index - 1;
                        } else {
                              indexToDrop = index;
                        }
                  } else if(direction === 'after'){
                        indexToDrop = index + 1;
                  }
            }
            return false;
      };
      
      service.drop = function(e){
            e.preventDefault();
            e.stopPropagation();
            // Get path to retrieve from the data transfer (see msDraggable)
            var coords = { x: e.clientX, y: e.clientY };
            var pr0t0 = e.originalTarget ? e.originalTarget.getBoundingClientRect : e.srcElement.getBoundingClientRect();
            if(coords.x <= pr0t0.left && coords.y <= pr0t0.top && coords.y >= pr0t0.bottom && coords.x >= pr0t0.right){
                  return false;
            }
            var droppedComponent = e.dataTransfer.getData('Text');
            // Check if the file is in cache or if it needs to be loaded via http
            // Then use the LogicalInheritance addComponent method to add the html string in a specific index (indexToDrop var holds the index)
            if($templateCache.get(droppedComponent)){
                  LogicalInheritance.addComponent($templateCache.get(droppedComponent), indexToDrop);
            } else {
                  LogicalInheritance.addComponent(droppedComponent, indexToDrop);
            }

            return false;
      };
      return service;
}]);