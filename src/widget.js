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


angular.module('adf.widget.news', ['adf.provider'])
  .value('newsServiceUrl', 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=JSON_CALLBACK&q=')
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
        feed: function(NewsService, config){
          if (config.url){
            return NewsService.get(config);
          }
        }
      },
      edit: {
        templateUrl: '{widgetsPath}/news/src/edit.html'
      }
    });
}
