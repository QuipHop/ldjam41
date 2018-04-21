import throttle from 'lodash.throttle';
import Player from '../objects/Player';
import ActionsModal from '../objects/ActionsModal';
import DealsModal from '../objects/DealsModal';
import { STYLES } from '../objects/Styles';
// import { ListView } from 'phaser-list-view';
const DEALS_LOOP_INTERVAL = 10000;
const MIN_BELIEVERS = 100;

export default class Main extends Phaser.State {

  create() {
    this.player = Player;
    this.templesCounter = 1;
    this.templeSprite = null;
    this.initBg();
    this.initUi();

    this.templesGroup = this.game.add.group();
    this.generateTempleIcon();
    this.runDealsLoop();
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

    this.preachBtn = this.game.add.image(this.game.world.centerX, this.game.world.height - 100, 'btn_preach');
    this.preachBtn.anchor.setTo(0.5);
    this.preachBtn.inputEnabled = true;
    this.preachBtn.events.onInputDown.add(() => this.player.preach());

    this.dealsBtn = this.game.add.image(this.game.world.width - 50, this.game.world.height - 100, 'btn_deals');
    this.dealsBtn.anchor.setTo(1, 0.5);
    this.dealsBtn.inputEnabled = false;
    this.dealsBtn.alpha = STYLES.BTN_DISABLED_APLHA;
    this.dealsBtn.events.onInputDown.add(() => this.openDealsDialog());

    this.player.bindLabels(this.believersCounter, this.moneyCounter);
    this.increaseHandler = this.player.onIncrease.add(() => {
      this.checkTemples();
    });
  }

  checkTemples() {
    if (this.player.believers / this.templesCounter > 100) {
      this.generateTempleIcon();
      this.templesCounter++;
    }
  };

  generateTempleIcon() {
    this.templeSprite = this.game.add.image(
      this.game.rnd.integerInRange(200, this.game.world.width - 300),
      this.game.rnd.integerInRange(200,  this.game.world.height - 300),
      'temple'
    );

    this.templeSprite.scale.setTo(0.2);
    this.templesGroup.add(this.templeSprite);
  }

  openActionsDialog() {
    const actionsDialog = new ActionsModal(this.game);
  }

  openDealsDialog() {
    this.dealsBtn.inputEnabled = false;
    this.dealsBtn.alpha = STYLES.BTN_DISABLED_APLHA;
    const dealsDialog = new DealsModal(this.game);
  }

  runDealsLoop() {
    setInterval(() => {
      if (this.player.believers > MIN_BELIEVERS) {
        this.dealsBtn.inputEnabled = true;
        this.dealsBtn.alpha = 1;
      }
    }, DEALS_LOOP_INTERVAL);
  }

  render() {
    // Sprite debug info
    // game.debug.spriteBounds(this.templeSprite, 32, 32);
  }
}
