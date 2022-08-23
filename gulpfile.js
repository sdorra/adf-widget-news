let gulp = require('gulp');
let connect = require('gulp-connect');
let wiredep = require('wiredep').stream;
let $ = require('gulp-load-plugins')();
let del = require('del');
let jsReporter = require('jshint-stylish');
let annotateAdfPlugin = require('ng-annotate-adf-plugin');
let pkg = require('./package.json');

let url = require('url');
let queryString = require('query-string');
let request = require('request');
let FeedParser = require('feedparser');

let annotateOptions = {
  plugin: [
    annotateAdfPlugin
  ]
};

let templateOptions = {
  root: '{widgetsPath}/news/src',
  module: 'adf.widget.news'
};

/** lint **/

gulp.task('csslint', function () {
  gulp.src('src/**/*.css')
    .pipe($.csslint())
    .pipe($.csslint.reporter());
});

gulp.task('jslint', function () {
  gulp.src('src/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter(jsReporter));
});

gulp.task('lint', ['csslint', 'jslint']);

/** serve **/

gulp.task('templates', function () {
  return gulp.src('src/**/*.html')
    .pipe($.angularTemplatecache('templates.tpl.js', templateOptions))
    .pipe(gulp.dest('.tmp/dist'));
});

gulp.task('sample', ['templates'], function () {
  let files = gulp.src(['src/**/*.js', 'src/**/*.css', 'src/**/*.less', '.tmp/dist/*.js'])
    .pipe($.if('*.js', $.angularFilesort()));

  gulp.src('sample/index.html')
    .pipe(wiredep({
      directory: './components/',
      bowerJson: require('./bower.json'),
      devDependencies: true,
      dependencies: true
    }))
    .pipe($.inject(files))
    .pipe(gulp.dest('.tmp/dist'))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['src/**'], ['sample']);
});

gulp.task('serve', ['watch', 'sample'], function () {
  let feed = function (req, resp, next) {
    let rawUrl = req.originalUrl;
    if (rawUrl.indexOf("/feed") === 0) {
      let parsedUrl = url.parse(rawUrl);
      let queryParams = queryString.parse(parsedUrl.query);

      let feedUrl = queryParams.url;

      let feedRequest = request(feedUrl);

      let feedparser = new FeedParser();
      let feedEntries = [];
      let feedDescription = '';
      let feedTitle = '';
      let feedLink = '';
      let feedError;


      // error when server request failed
      feedRequest.on('error', function (error) {
        resp.writeHead(400, error.toString());
        resp.end();
      });

      // open a stream after a valid server response
      feedRequest.on('response', function () {
        if (resp.statusCode !== 200) {
          this.emit('error', new Error('Bad status code'));
        }
        let stream = this; // `this` is `req`, which is a stream
        stream.pipe(feedparser);
      });

      // error when feed url could not be parsed
      feedparser.on('error', function (error) {
        feedError = error;
      });

      // read all feed information and save them
      feedparser.on('readable', function () {
        let stream = this; // `this` is `feedparser`, which is a stream
        let item;
        while (item = stream.read()) {
          // if you want to test the parseLanguage filter function uncomment line below
          // feedDescription = {'en': 'english string', 'de': 'deutscher string'};
          feedDescription = item.meta.description;

          feedTitle = item.meta.title;
          feedLink = item.meta.link;

          feedEntries.push({
            title: item.title,
            link: item.link,
            contentSnippet: item.summary,
            author: item.author,
            pubDate: item.pubDate,
          });
        }
      });

      // return feed information - number of Entries configured by request
      feedparser.on('end', function () {
        if (feedError) {
          resp.writeHead(400, error.toString());
          resp.end();
        } else {
          let numberOfEntries = queryParams.num;
          feedEntries = feedEntries.slice(0, numberOfEntries);

          let feed = {feed: {entries: feedEntries, title: feedTitle, description: feedDescription, link: feedLink}};

          let callbackName = queryParams.callback;
          if (!callbackName) {
            callbackName = 'jsonp_callback';
          }

          resp.writeHead(200);
          resp.write('/**/ typeof ' + callbackName + ' === "function" && ');
          resp.write(callbackName + '(');
          resp.write(JSON.stringify(feed));
          resp.write(');');

          resp.end();
        }
      });

    } else {
      next();
    }
  };

  connect.server({
    root: ['.tmp/dist', '.'],
    livereload: true,
    port: 9002,
    middleware: function (connect, opt) {
      return [feed];
    }
  });
});

/** build **/

gulp.task('css', function () {
  gulp.src(['src/**/*.css', 'src/**/*.less'])
    .pipe($.if('*.less', $.less()))
    .pipe($.concat(pkg.name + '.css'))
    .pipe(gulp.dest('dist'))
    .pipe($.rename(pkg.name + '.min.css'))
    .pipe($.minifyCss())
    .pipe(gulp.dest('dist'));
});

gulp.task('js', function () {
  gulp.src(['src/**/*.js', 'src/**/*.html'])
    .pipe($.if('*.html', $.minifyHtml()))
    .pipe($.if('*.html', $.angularTemplatecache(pkg.name + '.tpl.js', templateOptions)))
    .pipe($.angularFilesort())
    .pipe($.if('*.js', $.replace(/'use strict';/g, '')))
    .pipe($.concat(pkg.name + '.js'))
    .pipe($.headerfooter('(function(window, undefined) {\'use strict\';\n', '})(window);'))
    .pipe($.ngAnnotate(annotateOptions))
    .pipe(gulp.dest('dist'))
    .pipe($.rename(pkg.name + '.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('dist'));
});

/** clean **/

gulp.task('clean', function (cb) {
  del(['dist', '.tmp'], cb);
});

gulp.task('default', ['css', 'js']);
