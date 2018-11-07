var gulp = require("gulp");
var browserSync = require("browser-sync");

//多个文件
browserSync({
  ui: {
    port: 3029,
  },
  files: ["./index.html", "./lib/main.js"]
});

const browserSyncInstance = browserSync.create();

// 静态服务器
gulp.task("default", function() {
  browserSyncInstance.init({
    port: 3030,
    server: {
      baseDir: "./",
      index: 'index.html',
    }
  });
  gulp.watch("./index.html").on("change", browserSyncInstance.reload);
  gulp.watch("./lib/main.js").on("change", browserSyncInstance.reload);
});

