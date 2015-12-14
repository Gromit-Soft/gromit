/*******************************************************************************
 * 
 * Copyright 2015 Gromit Soft Team   
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 ******************************************************************************/
 'use strict';

angular.module('gromitsoft').directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (!attrs.href && !attrs.ngHref) {
                /*
                 * We want to always have an href so Anchors can be keyboard accessible.
                 */
                elem.attr('href', '#');
            }

            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault();
                    if (!e.hasClass || !e.hasClass('disabled')) {
                        e.stopPropagation();
                    }
                });
            }
        }
    };
});