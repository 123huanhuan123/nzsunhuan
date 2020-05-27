//编写任务 管理当前项目

const gulp = require("gulp");
//拷贝html

// const htmlMin=require("gulp-htmlmin");
// gulp.task("copy-html",()=>{
//     return gulp.src("*.html")
//     .pipe(htmlMin({ collapseWhitespace: true }))
//     .pipe(gulp.dest("dist/"));
// })
const htmlmin = require('gulp-htmlmin');
 
gulp.task('minify', () => {
  return gulp.src('*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});
//拷贝图片
gulp.task("images",()=>{
    return gulp.src("*.{jpg,png}")
    .pipe(gulp.dest("dist/images")).pipe(connect.reload());
})

//拷贝数据
gulp.task("data",()=>{
    return gulp.src(["*.json","!package.json"])
    .pipe(gulp.dest("dist/data")).pipe(connect.reload());
})

//拷贝js代码
gulp.task("scripts",()=>{
    return gulp.src(["*.js","!gulpfile.js"])
    .pipe(gulp.dest("dist/js")).pipe(connect.reload());
})

//处理scss代码  
const scss=require("gulp-sass");
const minifyCSS=require("gulp-minify-css");
const rename=require("gulp-rename");

gulp.task("scss1",()=>{
    return gulp.src("stylesheet/index.scss")
    .pipe(scss())
    .pipe(gulp.dest("dist/css"))
    .pipe(minifyCSS())
    .pipe(rename("index.min.css"))
    .pipe(gulp.dest("dist/css")).pipe(connect.reload());
})

gulp.task("scss2",()=>{
    return gulp.src("stylesheet/css.scss")
    .pipe(scss())
    .pipe(gulp.dest("dist/css"))
    .pipe(minifyCSS())
    .pipe(rename("css.min.css"))
    .pipe(gulp.dest("dist/css")).pipe(connect.reload());
})

//执行所有文件
gulp.task("build",["minify","images","data","scripts","scss1","scss2"],()=>{
    console.log("项目建立成功"); 
})


gulp.task("wacth",()=>{
    gulp.watch("*.html",["minify"]);
    gulp.watch("*.{jpg,png}",["images"]);
    gulp.watch(["*.json","!package.json"],["data"]);
    gulp.watch(["*.js","!gulpfile.js"],["scripts"]);
    gulp.watch("stylesheet/index.scss",["scss1"]);
    gulp.watch("stylesheet/css.scss",["scss2"]);
})

const connect=require("gulp-connect");

gulp.task("server",function(){
    connect.server({
        root:"dist",
        port:8888,
        livereload:true
    })
})

gulp.task("default",["wacth","server"]);