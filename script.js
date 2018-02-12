/**
 * script.js
 */

/* 読み込んだグローバル変数 */
/* globals clm pModel */
/* globals GlassesStamp */

/* フラグ */
const flags = {
  showDetectResult: false
};

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

      // ビデオの設定
      const jqVideo = $('#original-video');
      const video = jqVideo.get(0);
      video.srcObject = stream;

      // キャンバスの取得
      const jqCanvas = $('#overwrite-canvas');
      const canvas = jqCanvas.get(0);
      const ctx = canvas.getContext('2d');

      // 顔認識の初期化
      const ctracker = new clm.tracker();
      ctracker.init(pModel);


      // ビデオが再生できるようになったとき
      video.addEventListener('canplay', () => {

        // キャンバスのリサイズ(clmtrackerの仕様なのかビデオのサイズも指定)
        const videoWidth = jqVideo.width();
        const videoHeight = jqVideo.height();
        video.width = videoWidth;
        video.height = videoHeight;
        canvas.width = videoWidth;
        canvas.height = videoHeight;

        // ビデオの再生と顔認識を開始
        video.play();
        ctracker.start(video);

        // 描画開始
        (function draw() {
          requestAnimationFrame(draw);

          // キャンバスをクリアとビデオの転写
          jqCanvas.clearCanvas();
          ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

          // 顔認識
          const facePositions = ctracker.getCurrentPosition();
          if (facePositions) {
            $('#log-area').text('');

            // スタンプを表示
            for (let stamp of Object.values(stamps)) {
              stamp.drawStamp(jqCanvas, facePositions);
            }

            // 顔認識結果を描画
            if (flags.showDetectResult) {
              ctracker.draw(canvas);
            }
          } else {
            $('#log-area').text('顔認識に失敗しました');
          }
        })();

      });

    })
    .catch(error => {
      // メディアが取得失敗した場合
      console.error('mediaDevice.getUserMedia() :', error);
      $('#error-get-media').show();
    });


  /**
   * 顔認識結果の表示切替UI
   */
  $('#detection-show').on('change', function () {
    if ($(this).is(':checked')) {
      flags.showDetectResult = true;
    } else {
      flags.showDetectResult = false;
    }
  });


  /**
   * めがねのUI
   */
  // めがねの高さ比
  document.getElementById('meganeHRanger').addEventListener('input', function () {
    stamps.glasses.glassesSizeH = this.value;
    $('#meganeHMeter').text(stamps.glasses.glassesSizeH);
  });
  // めがねの幅比
  document.getElementById('meganeWRanger').addEventListener('input', function () {
    stamps.glasses.glassesSizeW = this.value;
    $('#meganeWMeter').text(stamps.glasses.glassesSizeW);
  });


});




