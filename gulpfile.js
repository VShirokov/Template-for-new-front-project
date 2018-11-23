var   		 gulp = require('gulp'),
		 beautify = require('gulp-html-beautify'),
	   		 sass = require('gulp-sass'),
	concat_script = require('gulp-concat'),	
	      plumber = require('gulp-plumber'),
		  css_min = require('gulp-cssnano'),
		   rename = require('gulp-rename'),
	   min_script = require('gulp-uglifyjs'),
	  browserSync = require('browser-sync'),
	  		  del = require('del'),
	  	 imagemin = require('gulp-imagemin'),
	  	 pngquant = require('imagemin-pngquant'),
	    svgSprite = require('gulp-svg-sprite'),
	       svgmin = require('gulp-svgmin'),
		  cheerio = require('gulp-cheerio'),
		  replace = require('gulp-replace'),
	 autoprefixer = require('gulp-autoprefixer');	


gulp.task('sass', function () {
  return gulp.src('src/sass/**/*.sass')
  	.pipe(plumber({}))		
    .pipe(sass())
    .pipe(autoprefixer(['last 10 versions', '> 1%', 'ie 11'], {cascade:true}))
    .pipe(gulp.dest('src/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('min_script', function() {
	return gulp.src('src/js/**/*.js')
	.pipe(plumber({}))
	//.pipe(concat_script('libs.min.js'))
	.pipe(min_script())
	.pipe(gulp.dest('dist/js'));
});

gulp.task('css_min', ['sass'], function () {
	return gulp.src([
		'src/css/main.css',
		'src/css/normalize.css'])
	.pipe(plumber({}))
	.pipe(concat_script('main.css'))
	.pipe(css_min())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('clean', function() {
	return del.sync(['dist/css', 'dist/js','dist/fonts/', 'dist/img/']);
});

gulp.task('img', function() {
	return gulp.src('src/img/**/*.png')
	.pipe(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	}))
	.pipe(gulp.dest('dist/img'));
});
gulp.task('svgMin', function () {
	return gulp.src('src/img/svgformin/*.svg')
	// minify svg
	.pipe(svgmin({
		js2svg: {
			pretty: true
		}
	}))
	// remove all fill, style and stroke declarations in out shapes
	.pipe(cheerio({
		run: function ($) {
			$('[fill]').removeAttr('fill');
			$('[stroke]').removeAttr('stroke');
			$('[style]').removeAttr('style');
		},
		parserOptions: {xmlMode: true}
	}))
	// cheerio plugin create unnecessary string '&gt;', so replace it.
	.pipe(replace('&gt;', '>'))
	.pipe(gulp.dest('dist/img/minsvg'));
});
gulp.task('svgSprite', function () {
	return gulp.src('src/img/**/*.svg')
	// minify svg
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		// remove all fill, style and stroke declarations in out shapes
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
		// cheerio plugin create unnecessary string '&gt;', so replace it.
		.pipe(replace('&gt;', '>'))
		// build svg sprite
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "sprite.svg",
				}
			}
		}))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'dist',
		},
		notify: false
	});
})
gulp.task('watch', ['min_script','css_min'], function () {
	gulp.watch('src/sass/**/*.sass', ['css_min'], browserSync.reload);
	gulp.watch('dist/css/**/*.css', browserSync.reload);
	gulp.watch('dist/**/*.html', browserSync.reload);
	gulp.watch('src/js/*.js', ['min_script'], browserSync.reload);
	gulp.watch('dist/js/**/*.js', browserSync.reload);
});

gulp.task('build',['clean','img', 'css_min', 'min_script', 'pug_html'], function() {

	var bild_fonts = gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('fonts', function() {
	return gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));	
});

gulp.task('work', ['watch', 'browser-sync']);