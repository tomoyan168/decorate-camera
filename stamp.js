/**
 * スタンプの
 */


/**
 * @classdesc スタンプの抽象クラス
 * @class Stamp
 */
class Stamp {


  /**
   * スタンプインスタンスを生成
   * @param {string} imageSrc スタンプ画像の場所
   * @memberof Stamp
   */
  constructor(imageSrc) {
    this.imageSrc = imageSrc;
  }


  /**
   * スタンプを描画する
   * @param {object} canvasJQueryObject 描画対象のキャンバスのjQueryオブジェクト
   * @param {array} facePositions 顔のパーツの位置
   * @memberof Stamp
   */
  drawStamp(canvasJQueryObject, facePositions) {
    canvasJQueryObject.drawImage(this.calcDValue(facePositions));
  }


  /**
   * スタンプ画像の適切な位置・サイズを計算する
   * @returns {object} スタンプ画像の適切な位置・サイズ
   * @memberof Stamp
   */
  calcDValue() {
    return {
      x: 0,
      y: 0,
      w: 0,
      h: 0
    };
  }



}







/**
 * 眼鏡のスタンプ
 * 
 * @class GlassesStamp
 * @extends {Stamp}
 */
class GlassesStamp extends Stamp {
  /**
   * Creates an instance of GlassesStamp.
   * @param {object} glassesSize 
   * @memberof GlassesStamp
   */
  constructor(glassesSize) {
    super('stamps/glasses.png');
    this.glasses = {
      w: glassesSize.w,
      h: glassesSize.h
    };
  }

  /**
   * スタンプ画像の適切な位置・サイズを計算する
   * 
   * @param {any} facePositions 
   * @returns {object} スタンプ画像の適切な位置・サイズ(jCanvasのオプション値)
   * @memberof GlassesStamp
   */
  calcDValue(facePositions) {

    /*
    // 認識パターン1
    const x = (facePositions[27][0] + facePositions[32][0]) / 2;
    const y = (facePositions[27][1] + facePositions[32][1]) / 2;
    const w = facePositions[28][0] - facePositions[23][0];
    const h = (Math.abs(facePositions[26][1] - facePositions[24][1]) + Math.abs(facePositions[31][1] - facePositions[29][1])) / 2;
    const rad = Math.atan(
      (facePositions[28][1] - facePositions[23][1]) / (facePositions[28][0] - facePositions[23][0])
    ) * 180 / Math.PI;
    */

    // 認識パターン2
    const x = (facePositions[27][0] + facePositions[32][0]) / 2;
    const y = (facePositions[27][1] + facePositions[32][1]) / 2;
    const w = facePositions[28][0] - facePositions[23][0];
    const h = (Math.abs(facePositions[26][1] - facePositions[24][1]) + Math.abs(facePositions[31][1] - facePositions[29][1])) / 2;
    const rad = Math.atan(
      (facePositions[27][1] - facePositions[32][1]) / (facePositions[27][0] - facePositions[32][0])
    ) * 180 / Math.PI;


    return {
      source: this.imageSrc,
      x: x,
      y: y,
      width: w * this.glasses.w,
      height: h * this.glasses.h,
      rotate: rad,
      fromCenter: true
    };
  }

}


