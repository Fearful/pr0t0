angular.module('pr0t0Editor').service('LogicalInheritance', ['$rootScope', 'pr0t0Toolbars', '$compile', function(rootScope, toolbars, $compile){
	var componentContainer = false,
		components = [],
		isEmpty = true,
		currentSelection = false,
		parentBody = false,
		selectionContainer = angular.element('<div class="selection"></div>');

	function setSelectedComponent(element){
		if(!element && element !== false){
			return;
		}
		if(element.length && element.length > 0 && element[0].dom){
			element = element[0].dom[0];
		}
		if(element.length && element.length > 0){
			element = element[0];
		}
		if(!element){
			currentSelection = false;
			return element;			
		}
		readComponents();
		if(!(components.length > 0)){
			return;
		}
		var selectedComponent = false;
		selectedComponent = _.find(components, function(comp){ 
			return comp.dom[0] === element;
		});
		if(typeof msConfig().afterSelection === 'function'){
			msConfig().afterSelection(selectedComponent, false);
		}
		if(selectedComponent){
			currentSelection = selectedComponent;
			if(typeof msConfig().selectedComponentCb === 'function'){
				msConfig().selectedComponentCb(selectedComponent, selectionContainer[0]);
			}
			return selectedComponent;
		} else {
			if(selectionContainer[0].parentElement !== null){
				selectionContainer[0].parentElement.removeChild(selectionContainer[0]);
			}
			currentSelection = false;
			return false;
		}
	};

	function getSelectedComponent(){
		return currentSelection;
	};

	function retrieveListOfComponents(container){
		if(!container){
			return [];
		}
		return container.tagName === "UL" ? readComponents(angular.element(container)) : readComponents(angular.element(container).find("ul"));
	};

    function isDescendant(parent, child) {
    	if(!child || !parent){
    		return false;
    	}
         var node = child.parentNode;
         while (node !== null) {
             if (node === parent) {
                 return true;
             }
             node = node.parentNode;
         }
         return false;
    };

	function detach ( comp ) {
		var index = _.findIndex(components, comp);
		components.splice(index, 1);
		msConfig().updateEditor(50, components);
	    return comp;
	};
	
	function readComponents(container){
		if(!container || container.length === 0){
			return;
		}
		var currentComponents = [];
		_.each(container[0].children, function(child){
			if(child){
				var obj = angular.element(child).scope().cmp;
				if(obj && obj.content){
					currentComponents.push(obj);
				}
			}
		})
		components = currentComponents;
		return components;
	};

	function insertComponent(html, index){
		var component = toolbars.wrapComponent(angular.element(html)[0]);
		component.type = angular.element(html)[0].attributes[0].name;
		isEmpty = false;
		if(!index && index !== 0){
			components.push(component);
			rootScope.$broadcast('newComponent', component);
			editorConfig().updateEditor(100, components);
			return;
		}
		components.splice(index, 0, component);
		rootScope.$broadcast('newComponent', component);
		editorConfig().updateEditor(100, components);
	};

	function copyComponent(comp){
		var index = _.findIndex(components, comp);
		var newCopy = JSON.parse(angular.toJson(comp));
		var cloned = angular.element(comp.dom[0].cloneNode(true));
		var editableContainers = _.filter(cloned.find("div"), function(chContainer){ return chContainer.attributes["contenteditable"]; });
		if(editableContainers.length > 0){
			_.each(editableContainers, function(ed){
				var parent = ed.parentElement;
				var content = ed.children[0];
				parent.appendChild(content);
				parent.removeChild(ed);
			});
		}
		var images = _.filter(cloned.find("img"), function(chContainer){ return chContainer.attributes["ng-src"]; });
		_.each(images,function(im){
			angular.element(im).removeAttr("ng-src");
		})
		newCopy.content = cloned[0].innerHTML;
		newCopy.dom = cloned;
		components.splice(index + 1, 0, newCopy);
		msConfig().updateEditor(50, components);
	    return comp;
	};

	function getIndex(element){
		if(!element){
			return;
		}
		var i = 1,
	        prev = element.previousElementSibling;

	    if (prev) {
	        do ++i;
	        while (prev = prev.previousElementSibling);
	    } else {
	        while (element = element.previousSibling) {
	            if (element.nodeType === 1) {
	                ++i;
	            }
	        }
	    }
	    return i - 1;
	};

	return {
		components: retrieveListOfComponents,
		selectedComponent: getSelectedComponent,
		addComponent: insertComponent,
		deleteComponent: detach,
		duplicateComponent: copyComponent,
		setSelectedComponent: setSelectedComponent,
		isDescendant: isDescendant,
		readContent: function(viewValue){
			if(!viewValue || !(viewValue.length)){
				return [];
			}
			var mockUpContainer = angular.element("<div></div>");
			var mockUp = angular.element(viewValue);
			var clone = mockUp[0].cloneNode(true);
			var cmpContainer = msConfig().filterContainer(mockUp[0]);
			cmpContainer.innerHTML = "";
			mockUpContainer.append(mockUp);
			if(mockUpContainer[0].innerHTML !== msConfig().mode.originalBody){
				msConfig({
					mode: {
						originalBody: mockUpContainer[0].innerHTML
					}
				})
			}
			parentBody = angular.element(clone);
			var children = _.filter(msConfig().filterContainer(clone).children, function(child){ 
				if(child.attributes[0] && child.attributes[0].name === 'ms-placeholder'){ return false };
				return _.isElement(child); });
			if(cmpContainer){
				var wrappedComponents = [];
				angular.forEach(children, function(child){
					if(child){
						if(_.isElement(child)){
							var wrap = toolbars.wrapComponent(child);
							wrappedComponents.push(wrap);
						}
					}
				});
				components = wrappedComponents;
				if(components.length > 0){
					isEmpty = false;
				}
				return wrappedComponents;
			}
			return viewValue;
		},
		getComponentContainer: function(){
			return componentContainer;
		},
		setContainer: function(element){
			if(!element){
				return;
			}
			componentContainer = element;
			readComponents();
			return;
		},
		hasComponents: function(){
			return !isEmpty;
		},
		hideSelection: function(){
			if(selectionContainer[0].parentElement){
				selectionContainer[0].parentElement.removeChild(selectionContainer[0]);
			}
		}

	}
}]);