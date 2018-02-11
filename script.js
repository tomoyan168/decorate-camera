/**
 * script.js
 */

/* 読み込んだグローバル変数 */
/* globals clm pModel */
/* globals GlassesStamp */



/* スタンプの生成 */
const stamps = {
  glasses: new GlassesStamp({ w: 1.3, h: 2.2 })
};



$(function () {

  // メディアの取得
  navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'user',
      frameRate: {
        ideal: 17
      }
    },
    audio: false
  })
    .then(stream => {
      // ビデオの設定
      const video = $('#original-video').get(0);
      video.srcObject = stream;
      video.play();

      // キャンバスの取得とリサイズ
      const jqCanvas = $('#overwrite-canvas');
      const canvas = jqCanvas.get(0);
      canvas.width = video.width;
      canvas.height = video.height;

      // 顔検出
      const ctracker = new clm.tracker();
      ctracker.init(pModel);
      ctracker.start(video);


      // 描画開始
      (function draw() {
        requestAnimationFrame(draw);
        // 顔認識
        const facePositions = ctracker.getCurrentPosition();
        if (facePositions) {
          // キャンバスをクリア
          jqCanvas.clearCanvas();

          // スタンプを表示
          for (let stamp of Object.values(stamps)) {
            stamp.drawStamp(jqCanvas, facePositions);
          }

          // 顔認識結果を描画
          // ctracker.draw(canvas);
        }
      })();

    })
    .catch(error => {
      // メディアが取得失敗した場合
      console.error('mediaDevice.getUserMedia() :', error);
      $('#error-get-media').show();
    });

});




