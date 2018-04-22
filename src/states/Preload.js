import WebpackLoader from 'phaser-webpack-loader';
import AssetManifest from '../AssetManifest';

/**
 * Preload the game and display the loading screen.
 */
export default class Preload extends Phaser.State {
  /**
   * Once loading is complete, switch to the main state.
   */
  preload() {
    this.game.load.audio('ding', 'assets/ding.mp3');
    this.game.load.audio('evil_laugh', 'assets/evil_laugh.mp3');
    this.game.load.audio('preach', 'assets/preach.mp3');
    this.game.load.spritesheet('earth', 'assets/earth.png', 256, 192, 2);
    this.game.load.spritesheet('fire', 'assets/fire.png', 64, 128);
  }

  create() {

    this.game.load.crossOrigin = 'anonymous';
    this.game.load.maxParallelDownloads = Infinity;

    this.loadingTxt = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Loading', {});
    this.loadingTxt.anchor.setTo(0.5);
    // Begin loading all of the assets.

    this.game.plugins.add(WebpackLoader, AssetManifest, '')
      .load()
      .then(() => {
        this.game.state.start('Menu');
      });
  }

  /**
   * Update the loading display with the progress.
   */
  update() {

  }
}
