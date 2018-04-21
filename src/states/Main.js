import throttle from 'lodash.throttle';
import Player from '../objects/Player';
import ActionsModal from '../objects/ActionsModal';
import { STYLES } from '../objects/Styles';
// import { ListView } from 'phaser-list-view';

export default class Main extends Phaser.State {

  create() {
    this.player = Player;
    this.initBg();
    this.initUi();
  }

  update() {
    // this.believersCounter
  }

  initBg() {
    this.bg = this.game.add.image(0, 0, 'earth');
    this.bg.width = this.game.world.width;
    this.bg.height = this.game.world.height;
  }

  initUi() {
    // this.test = this.game.add.text(0, 0, 'TEST ABCD AASDGKJHG qefefjlfjq', STYLES.MAIN);
    this.believersGroup = this.game.add.group();
    this.believersCounter = this.game.add.text(100, 0, `/${this.player.believers}`, STYLES.MAIN);
    this.believersIcon = this.game.add.image(0, 0, 'prayer');
    this.believersIcon.scale.setTo(0.3);
    this.believersGroup.addMultiple([this.believersIcon, this.believersCounter]);
    this.believersGroup.x = this.game.world.centerX - 200;

    this.moneyCounter = this.game.add.text(this.game.world.centerX + 100, 0, `$${this.player.money}`, STYLES.MAIN);


    this.actionBtn = this.game.add.image(50, this.game.world.height - 100, 'btn_actions');
    this.actionBtn.anchor.setTo(0, 0.5);
    this.actionBtn.inputEnabled = true;
    this.actionBtn.events.onInputDown.add(() => this.openActionsDialog());
    this.player.bindLabels(this.believersCounter, this.moneyCounter);
  }

  openActionsDialog() {
    console.log('here');
    const wasteContainer = new ActionsModal(this.game);
    // wasteContainer.onDestroy.add(() => {
    //     wasteContainer.destroy();
    // })
  }
}
