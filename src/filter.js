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

function ToDate() {
  return function (date) {
    if (date === '') {
      return null;
    }
    return new Date(date);
  };
}

/**
 * this filter function handles descriptions of the form
 * `{"en"=>"Software development platform", "de"=>"Software-Entwicklungsplattform"}` which offer different language
 * encodings for an string.
 * If par is in fact not a string but an object we check if the browser language is one of the keys of par and return
 * the value of that key.
 */
function ParseLanguage() {
  return function (param){
    if(typeof param === 'object' && param !== null){
      const lang = navigator.language || navigator.userLanguage;
      if(param.hasOwnProperty(lang)){
        return param[lang];
      }
      // language is not defined, as default case we return the original object
      return param;
    }
    return param; // not an object
  };
}

angular.module('adf.widget.news')
  .filter('toDate', ToDate);

angular.module('adf.widget.news')
  .filter('parseLanguage', ParseLanguage);


