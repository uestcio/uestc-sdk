var gulp = require('gulp');
var ts = require('gulp-typescript');
var typedoc = require("gulp-typedoc");
var rename = require("gulp-rename");
var tsProject = ts.createProject('tsconfig.json');

gulp.task('default', ['tsc', 'typedoc']);

gulp.task('tsc', function () {
    var tsResult = tsProject.src()
        .pipe(ts(tsProject));

    return tsResult.js.pipe(rename(function (path) {
            path.dirname = path.dirname.replace('src', '.');
        })).pipe(gulp.dest('dist'));
});

gulp.task('typedoc', function () {
    return gulp
        .src(['src/**/*.ts'])
        .pipe(typedoc({
            includeDeclarations: true,
            module: 'commonjs',
            readme: 'none',
            target: 'es5',
            out: 'docs/',
            name: 'UESTC SDK',
            version: true
        }));
});
