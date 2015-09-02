angular.module('pr0t0Editor').factory('pr0t0Sanitize', ['$sanitize',
      function pr0t0SanitizeFactory($sanitize) {
            return function pr0t0Sanitize(unsafe, oldsafe, ignore) {
                  // recursive function that returns an array of angular.elements that have the passed attribute set on them
                  function getByAttribute(element, attribute) {
                        var resultingElements = [];
                        var childNodes = element.children();
                        if (childNodes.length) {
                              angular.forEach(childNodes, function(child) {
                                    resultingElements = resultingElements.concat(getByAttribute(angular.element(child), attribute));
                              });
                        }
                        if (element.attr(attribute) !== undefined) resultingElements.push(element);
                        return resultingElements;
                  }
                  // unsafe and oldsafe should be valid HTML strings
                  // any exceptions (lets say, color for example) should be made here but with great care
                  // setup unsafe element for modification
                  var unsafeElement = angular.element('<div>' + unsafe + '</div>');
                  // replace all align='...' tags with text-align attributes
                  // angular.forEach(getByAttribute(unsafeElement, 'align'), function(element) {
                  //       element.css('text-align', element.attr('align'));
                  //       element.removeAttr('align');
                  // });
                  // angular.forEach(getByAttribute(unsafeElement, 'bgcolor'), function(element) {
                  //       element.css('background', element.attr('bgcolor'));
                  //       element.removeAttr('bgcolor');
                  // });

                  // get the html string back
                  var safe;
                  unsafe = unsafeElement[0].innerHTML;
                  try {
                        safe = $sanitize(unsafe);
                        // do this afterwards, then the $sanitizer should still throw for bad markup
                        if (ignore) safe = unsafe;
                  } catch (e) {
                        safe = oldsafe || '';
                  }
                  return safe;
            };
      }
]);