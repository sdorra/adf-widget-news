/*
 * The MIT License
 *
 * Copyright (c) 2015, Sebastian Sdorra
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

angular.module('adf.widget.news')
  .service('NewsService', NewsService);

function NewsService($q, $http, newsServiceUrl){
  function createUrl(config){
    if (!config.num){
      config.num = 5;
    }
    return newsServiceUrl + encodeURIComponent(config.url) + '&num=' + config.num;
  }

  function loadFeed(config){
    var deferred = $q.defer();
    $http.get(createUrl(config))
      .success(function(data){
        if (data && data.feed){
          deferred.resolve(data.feed);
        } else {
          deferred.reject('response does not contain feed element');
        }
      })
      .catch(function(response) {
       deferred.reject('Service returned ' + response.status + ' --> ' + response.statusText);
    });
    return deferred.promise;
  }

  return {
    get: loadFeed
  };
}
