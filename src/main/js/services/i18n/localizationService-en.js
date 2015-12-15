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

var createI18N = function() {
var i18n = {};

function LocalizationException(message) {
  this.name = 'LocalizationException';
  this.message= message;
}
LocalizationException.prototype = new Error();
LocalizationException.prototype.constructor = LocalizationException;

var vp = function(key, param, index) { 
    if (gromit.isInvalidL10NArgument(param) && !_.isNumber(param)) { 
        throw new LocalizationException('Missing required parameter number ' + index + ' for localization key: ' + key);
    }
};

i18n.getI18n_general_error_notfound=function(p0){vp('general_error_notfound', p0, 0);return 'There was a general error accessing the resource ' + p0 + '.  The server responded that the resource wasn\'t found.';};
i18n.invalid_client_time_behind='Your clock is behind';
i18n.invalid_client_time_ahead='Your clock is ahead';
i18n.getI18n_invalid_client_time_error=function(p0){vp('invalid_client_time_error', p0, 0);return 'Your computer\'s date and time (' + p0 + ') are incorrect.  Update your date and time to use Access Review.';};
i18n.getI18n_fatal_request_error=function(p0, p1, p2){vp('fatal_request_error', p0, 0);vp('fatal_request_error', p1, 1);vp('fatal_request_error', p2, 2);return 'There was an error calling the URL (' + p0 + ').  The server returned the status code ' + p1 + ' with the following data which was not parsable JSON data: ' + p2 + '';};
gromit.i18n = i18n;
return i18n;
};

createI18N();