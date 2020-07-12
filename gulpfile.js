let gulp = require('gulp');
let sass = require('gulp-sass');
let ts   = require('gulp-typescript');
//sass.compiler = require ('node-sass');

const path = {
	styles: {
		src: './sass/**/*.scss',
		dest: './css'
	},
	scripts: {
		src: './ts/**/*.ts',
		dest: './js'
	}
}

function styles(){
	return gulp.src(path.styles.src)
			.pipe(sass({outputStyle: 'compressed'}))
			.pipe(gulp.dest(path.styles.dest));
}

function scripts(){
	return gulp.src(path.scripts.src)
			.pipe(ts({
				noImplicitAny: true,
				outFile: 'output.js'
			}))
			.pipe(gulp.dest(path.scripts.dest));
}

function watch(){
	gulp.watch(path.styles.src, scripts);
	//gulp.watch(path.styles.src, styles);
}

let build = gulp.parallel(styles, scripts);


exports.default = build; 
exports.styles  = styles;
exports.scripts = scripts;
exports.watch   = watch;