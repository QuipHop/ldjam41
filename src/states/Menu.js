import { STYLES } from '../objects/Styles';

export default class Menu extends Phaser.State {

  create() {
    this.bg = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'tile');
    this.bg.autoScroll(0, -20);
    this.bg.alpha = 0.5;
    this.stage.backgroundColor = '#ead8c4';
    this.header = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'PRAY inc.', STYLES.MENU_HEADER);
    this.description = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'click to start', STYLES.DEAL_HEADER);
    this.description.anchor.setTo(0.5);
    this.header.anchor.setTo(0.5);
    this.header.setShadow(0, 5, 'rgba(0,0,0,.9)', 0);
    this.game.input.onDown.add(() => {
      this.game.state.start('Main');
    });
  }
}
