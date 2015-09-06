var gulp = require('gulp');
var ts = require('gulp-typescript');
var typedoc = require("gulp-typedoc");
var tsProject = ts.createProject('tsconfig.json');

gulp.task('default', ['typescript', 'typedoc']);

gulp.task('typescript', function () {
    var tsResult = tsProject.src()
        .pipe(ts(tsProject));

    return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('typedoc', function () {
    return gulp
        .src(['src/**/*.ts'])
        .pipe(typedoc({
            module: 'commonjs',
            target: 'es5',
            out: 'docs/',
            name: 'UESTC SDK'
        }))
    ;
});
