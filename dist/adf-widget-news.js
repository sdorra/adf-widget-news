(function(window, undefined) {'use strict';
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




angular.module('adf.widget.news', ['adf.provider'])
  .constant('newsServiceUrl', '')
  .config(RegisterWidget);

function RegisterWidget(dashboardProvider){
  dashboardProvider
    .widget('news', {
      title: 'News',
      description: 'Displays a RSS/Atom feed',
      category: 'News',
      templateUrl: '{widgetsPath}/news/src/view.html',
      controller: 'NewsController',
      controllerAs: 'vm',
      config: {
        num: 5,
        showTitle: true,
        showDescription: true
      },
      resolve: {
        feed: ["NewsService", "config", function(NewsService, config){
          if (config.url){
            return NewsService.get(config);
          }
        }]
      },
      edit: {
        templateUrl: '{widgetsPath}/news/src/edit.html'
      }
    });
}
RegisterWidget.$inject = ["dashboardProvider"];

angular.module("adf.widget.news").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/news/src/edit.html","<form role=form><div class=form-group><label for=url>Feed url</label> <input type=url class=form-control id=url ng-model=config.url placeholder=\"Enter feed url\"></div><div class=form-group><label for=num>Number of Entries</label> <input type=number class=form-control id=num ng-model=config.num></div><div class=form-group><label for=showTitle>Show Feed Title</label> <input type=checkbox class=form-control id=showTitle ng-model=config.showTitle></div><div class=form-group><label for=showTitle>Show Feed Description</label> <input type=checkbox class=form-control id=showDescription ng-model=config.showDescription></div></form>");
$templateCache.put("{widgetsPath}/news/src/view.html","<div class=news><div class=\"alert alert-info\" ng-if=!vm.feed>Please insert a feed url in the widget configuration</div><div ng-if=vm.feed><h3 ng-if=config.showTitle><a ng-href={{vm.feed.link}} target=_blank>{{vm.feed.title}}</a></h3><p ng-if=config.showDescription>{{vm.feed.description}}</p><div class=media ng-repeat=\"entry in vm.feed.entries\"><div class=media-body><h4 class=media-heading><a ng-href={{entry.link}} target=_blank>{{entry.title}}</a></h4><p>{{entry.contentSnippet}}</p><small>{{ (entry.author) ? entry.author + \',\' : \'\' }} {{entry.pubDate | toDate | date: \'yyyy-MM-dd HH:mm\'}}</small></div></div></div></div>");}]);
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
    $http.jsonp(createUrl(config))
      .success(function(data){
        if (data && data.feed){
          deferred.resolve(data.feed);
        } else {
          deferred.reject('response does not contain feed element');
        }
      })
      .error(function(err){
        deferred.reject(err);
      });
    return deferred.promise;
  }

  return {
    get: loadFeed
  };
}
NewsService.$inject = ["$q", "$http", "newsServiceUrl"];

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



angular.module('adf.widget.news')
  .filter('toDate', ToDate);

function ToDate(){
  return function(date){
    return new Date(date);
  };
}

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



angular.module('adf.widget.news')
  .controller('NewsController', NewsController);

function NewsController(feed, config){
  this.feed = feed;
}
NewsController.$inject = ["feed", "config"];
})(window);