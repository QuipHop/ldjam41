import throttle from 'lodash.throttle';
import Player from '../objects/Player';
import ActionsModal from '../objects/ActionsModal';
import DealsModal from '../objects/DealsModal';
import { STYLES } from '../objects/Styles';

// import { ListView } from 'phaser-list-view';
const DEALS_LOOP_INTERVAL = 10000;
const TEMPLE_ENEMY_LOOP_INTERVAL = 5000;
const MIN_BELIEVERS = 100;

export default class Main extends Phaser.State {

  create() {
    this.player = Player;
    this.templesCounter = 1;
    this.enemyTemplesCounter = 0;
    this.templeSprite = null;
    this.ding = this.game.add.audio('ding');
    this.evilLaugh = this.game.add.audio('evil_laugh');
    this.preachSound = this.game.add.audio('preach');
    this.initBg();
    this.initUi();
    this.stage.backgroundColor = '#2d2d36';
    this.templesGroup = this.game.add.group();
    this.generateTempleIcon();
    this.runDealsLoop();
    this.generetaEnemyTemple();
  }

  update() {
    // this.believersCounter
  }

  initBg() {
    this.bg = this.game.add.sprite(0, 0, 'earth');
    this.bg.width = this.game.world.width;
    this.bg.height = this.game.world.height;
    //  Here we add a new animation called 'walk'
    //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
    this.bg.animation = this.bg.animations.add('flow');
    this.bg.animations.play('flow', 1, true);
  }

  initUi() {
    // this.test = this.game.add.text(0, 0, 'TEST ABCD AASDGKJHG qefefjlfjq', STYLES.MAIN);
    let placeholder = this.game.add.image(0, 0, 'btn_empty_md');
    placeholder.width = this.game.world.width;
    placeholder.height = 100;

    this.logo = this.game.add.image(this.game.world.centerX, 50, 'logo');
    this.logo.anchor.setTo(0.5);
    this.logo.scale.setTo(3)
    this.logo.alpha = 0.6;

    this.believersGroup = this.game.add.group();
    this.believersCounter = this.game.add.text(60, 20, `/${this.player.believers}`, STYLES.HEADER);
    this.believersIcon = this.game.add.image(0, 0, 'prayer');
    this.believersIcon.scale.setTo(0.3);
    this.believersGroup.addMultiple([this.believersIcon, this.believersCounter]);
    this.believersGroup.x = this.game.world.centerX - 200;

    this.moneyCounter = this.game.add.text(this.game.world.centerX + 100, 20, `$${this.player.money}`, STYLES.HEADER);


    this.actionBtn = this.game.add.image(50, this.game.world.height - 100, 'btn_placeholder');
    this.actionBtn.anchor.setTo(0, 0.5);
    this.actionBtn.inputEnabled = true;
    this.actionBtn.events.onInputDown.add(() => this.openActionsDialog());
    this.actionBtnText = this.game.add.text(20, -20, 'Manage', STYLES.ACTION_BTN);
    this.actionBtn.addChild(this.actionBtnText);
    this.actionBtn.input.useHandCursor = true;

    this.preachBtn = this.game.add.image(this.game.world.centerX, this.game.world.height - 100, 'btn_placeholder');
    this.preachBtn.anchor.setTo(0.5);
    this.preachBtn.inputEnabled = true;
    this.preachBtn.events.onInputDown.add(() => {
      this.player.preach();
      if (!this.preachSound.isPlaying) {
        this.preachSound.play();
      }
    });
    this.preachBtnText = this.game.add.text(0, -20, 'PREACH', STYLES.ACTION_BTN);
    this.preachBtnText.anchor.setTo(0.5, 0);
    this.preachBtn.addChild(this.preachBtnText);
    this.preachBtn.input.useHandCursor = true;

    this.dealsBtn = this.game.add.image(this.game.world.width - 50, this.game.world.height - 100, 'btn_placeholder');
    this.dealsBtn.anchor.setTo(1, 0.5);
    this.dealsBtn.inputEnabled = false;
    this.dealsBtn.alpha = STYLES.BTN_DISABLED_APLHA;
    this.dealsBtn.events.onInputDown.add(() => this.openDealsDialog());
    this.dealsBtnText = this.game.add.text(-40, -20, 'Deals', STYLES.ACTION_BTN);
    this.dealsBtnText.anchor.setTo(1, 0);
    this.dealsBtn.addChild(this.dealsBtnText);
  
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
    const templeSprite = this.game.add.image(
      this.game.rnd.integerInRange(200, this.game.world.width - 300),
      this.game.rnd.integerInRange(200,  this.game.world.height - 300),
      'temple'
    );

    this.templesGroup.add(templeSprite);
  }

  openActionsDialog() {
    const actionsDialog = new ActionsModal(this.game);
  }

  openDealsDialog() {
    this.dealsBtn.inputEnabled = false;
    this.dealsBtn.input.useHandCursor = false;
    this.dealsBtn.alpha = STYLES.BTN_DISABLED_APLHA;
    const dealsDialog = new DealsModal(this.game);
  }

  runDealsLoop() {
    setInterval(() => {
      if (this.player.believers > MIN_BELIEVERS) {
        this.ding.play();
        this.dealsBtn.inputEnabled = true;
        this.dealsBtn.input.useHandCursor = true;
        
        this.dealsBtn.alpha = 1;
      }
    }, DEALS_LOOP_INTERVAL);
  }

  generetaEnemyTemple() {
    setInterval(() => {
      if (this.game.rnd.integerInRange(1, 10) > 5) {
        const xPos = this.game.rnd.integerInRange(200, this.game.world.width - 300);
        const yPos = this.game.rnd.integerInRange(200,  this.game.world.height - 300);
        const enemyTempleSprite = this.game.add.image(
          xPos,
          yPos,
          'enemy_temple'
        );
        // enemyTempleSprite.anchor.setTo(0.5, 1);
        enemyTempleSprite.inputEnabled = true;
        enemyTempleSprite.input.useHandCursor = true;
        enemyTempleSprite.events.onInputDown.add(() => {
          if (!this.evilLaugh.isPlaying) {
            this.evilLaugh.play();
          }
          const fireSprite = this.game.add.sprite(0, -50, 'fire');
          enemyTempleSprite.addChild(fireSprite);
          fireSprite.animations.add('fire');
          fireSprite.animations.play('fire', 30, true);
          setTimeout(() => {
            enemyTempleSprite.destroy();
            this.enemyTemplesCounter--;
          }, 2000);
        });
        this.templesGroup.add(enemyTempleSprite);
        this.enemyTemplesCounter++;
      }
    }, TEMPLE_ENEMY_LOOP_INTERVAL);

  }

  render() {
    // Sprite debug info
    // game.debug.spriteBounds(this.templeSprite, 32, 32);
  }
}
