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
    audio: false,
    video: {
      facingMode: {
        ideal: 'user'
      },
      frameRate: {
        ideal: 15
      }
    }
  })
    .then(stream => {

      // ストリームのサイズを取得
      const streamVideoSettings = stream.getVideoTracks()[0].getSettings();

      // ビデオの設定
      const video = $('#original-video').get(0);
      video.srcObject = stream;
      video.width = streamVideoSettings.width;
      video.height = streamVideoSettings.height;
      video.play();

      // キャンバスの取得とリサイズ
      const jqCanvas = $('#overwrite-canvas');
      const canvas = jqCanvas.get(0);
      const ctx = canvas.getContext('2d');
      canvas.width = streamVideoSettings.width;
      canvas.height = streamVideoSettings.height;

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
          ctx.drawImage(video, 0, 0, video.width, video.height);

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




