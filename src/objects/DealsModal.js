import Player from './Player'
import { ListView } from 'phaser-list-view';
import { STYLES } from './Styles';
import { DEALS } from './DealsSheet';

const MARGIN_LEFT = 60;

export default class ActionsModal {

	constructor (game) {

		this.game = game;
		this.player = Player;
    this.availableDeals = DEALS.filter(deal => deal.lvl === this.player.lvl)
    this.currentDeal = this.availableDeals[
      this.game.rnd.integerInRange(0, this.availableDeals.length - 1)
    ];

    this.openModal();
		this.onDestroy = new Phaser.Signal();
	}

	openModal(type) {

    const destroy = () => {
			backTxt.destroy();
			modalGroup.destroy(true);
			this.waitForDestroy();
    };

		let modalGroup = this.game.add.group();
		this.drawDeal();

		let backTxt = this.game.add.text(this.game.world.width - 20, 20, 'X', STYLES.CLOSE_BTN); 
		backTxt.anchor.setTo(1, 0);
		backTxt.inputEnabled = true;
		backTxt.events.onInputDown.add(() => {
			destroy();
    });

    const bgImage = this.game.add.image(0, 110, 'placeholder_deals');
    bgImage.width = this.game.world.width;
    bgImage.height = this.game.world.height - 100;
    this.headerText = this.game.add.text(MARGIN_LEFT, 120, this.currentDeal.header, STYLES.DEAL_HEADER);
    this.descriptionText = this.game.add.text(MARGIN_LEFT, 190, this.currentDeal.body, STYLES.DEAL_DESCRIPTION);

    this.effects = this.game.add.text(
      MARGIN_LEFT,
      340,
      `Effects: money: ${ this.currentDeal.reward > 0 ? '+' + this.currentDeal.reward : this.currentDeal.reward }$` + 
      `, believers: -${ this.currentDeal.decrese }.`,
      STYLES.DEAL_DESCRIPTION
    );

    this.dealBtn = this.game.add.text(MARGIN_LEFT, 500, 'Deal', STYLES.DEAL_BTN);
    this.dealBtn.inputEnabled = true;
    this.dealBtn.input.useHandCursor = true;
    this.dealBtn.events.onInputDown.add(() => {
      this.player.deal(this.currentDeal);
      destroy();
    });

    this.cancelBtn = this.game.add.text(350, 500, 'Refuse', STYLES.DEAL_BTN);
    this.cancelBtn.inputEnabled = true;
    this.cancelBtn.input.useHandCursor = true;
    this.cancelBtn.events.onInputDown.add(() => {
      this.player.decline(this.currentDeal);
      destroy();
    });
    // this.descriptionText = this.game.add.text(MARGIN_LEFT, 150, this.currentDeal.body, STYLES.DEAL_DESCRIPTION);

    // this.descriptionText.setTextBounds(0, 150, 724, 568);
    modalGroup.addMultiple([
      bgImage,
      this.headerText,
      this.descriptionText,
      this.effects,
      this.dealBtn,
      this.cancelBtn,
    ]);

	}

    drawDeal() {

    }

	waitForDestroy() {
		this.onDestroy.dispatch();
  }
  
}
