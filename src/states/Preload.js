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
        this.game.state.start('Main');
      });
  }

  /**
   * Update the loading display with the progress.
   */
  update() {

  }
}
