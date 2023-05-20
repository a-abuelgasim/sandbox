const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const { exec } = require('child_process');
const gulp = require('gulp');
const minify = require('gulp-clean-css');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');

const dirs = {
	dest: 'dist',
	src: 'src',
};

const buildPort = 3030;


/* DEV SUBTASKS */
gulp.task('serve', () => {
	browserSync.init({
		open: false,
		server: `./${dirs.src}`,
	});

	gulp.watch(`./${dirs.src}/sass/**/*.scss`, gulp.series('sass'));
	gulp.watch(`./${dirs.src}/**/*.{html,js}`).on('change', browserSync.reload);
});


gulp.task('sass', () => {
	return gulp.src(`./${dirs.src}/sass/**/*.scss`)
		.pipe(sourcemaps.init())
		.pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(`./${dirs.src}/css`))
		.pipe(browserSync.stream());
});


/* BUILD SUBTASKS */
gulp.task('clean', async () => {
	exec(`rm -rf ./${dirs.dest}`);
});


gulp.task('copy', () => {
	return gulp.src(`./${dirs.src}/{**/*.html,assets/**/*,img/**/*}`)
		.pipe(gulp.dest(`./${dirs.dest}/`));
});


gulp.task('js', () => {
	return gulp.src(`./${dirs.src}/js/**/*.js`)
		.pipe(terser())
		.pipe(gulp.dest(`./${dirs.dest}/js/`));
});


gulp.task('build-sass', () => {
	return gulp.src(`./${dirs.src}/sass/**/*.scss`)
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest(`./${dirs.src}/css`));
});


gulp.task('css', gulp.series('build-sass', () => {
	return gulp.src(`./${dirs.src}/css/**/*.css`)
		.pipe(minify())
		.pipe(gulp.dest(`./${dirs.dest}/css/`));
}));


/* MAIN TASKS */
gulp.task('default', gulp.series('sass', 'serve'));

gulp.task('build', gulp.series(
	'clean',
	gulp.parallel('copy', 'js', 'css')
));

gulp.task('serve-build', gulp.series('build', () => {
	browserSync.init({
		open: false,
		port: buildPort,
		server: `./${dirs.dest}`,
	});
}));
