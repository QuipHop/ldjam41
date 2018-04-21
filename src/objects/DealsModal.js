import Player from './Player'
import { ListView } from 'phaser-list-view';
import { STYLES } from './Styles';
import { DEALS } from './DealsSheet';

const MARGIN_LEFT = 30;

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
		let bg = this.game.add.graphics(0, 0);
		bg.inputEnabled = true;
		bg.beginFill('#FFF', 0.5);
		bg.drawRect(0, 50, this.game.world.width, this.game.world.height - 50);
		// this.cartLabel = this.game.add.text(10, 5, '', STYLES.MAIN); 

		let bounds = new Phaser.Rectangle(0, 110, this.game.world.width, this.game.world.height - 50);

		this.drawDeal();
		// modalGroup.add(listView);

		this.game.world.bringToTop(bg);

		let backTxt = this.game.add.text(this.game.world.width - 10, 5, 'X', STYLES.MAIN); 
		backTxt.anchor.setTo(1, 0);
		backTxt.inputEnabled = true;
		backTxt.events.onInputDown.add(() => {
			destroy();
    });

    this.headerText = this.game.add.text(MARGIN_LEFT, 100, this.currentDeal.header, STYLES.DEAL_HEADER);
    this.descriptionText = this.game.add.text(MARGIN_LEFT, 150, this.currentDeal.body, STYLES.DEAL_DESCRIPTION);

    this.effects = this.game.add.text(
      MARGIN_LEFT,
      300,
      `Effects: money: ${ this.currentDeal.reward > 0 ? '+' + this.currentDeal.reward : this.currentDeal.reward }` + 
      `, believers: ${ this.currentDeal.decrese < 0 ? this.currentDeal.decrese : '+' + this.currentDeal.decrese }.`,
      STYLES.DEAL_DESCRIPTION
    );

    this.dealBtn = this.game.add.text(MARGIN_LEFT, 400, 'Deal', STYLES.DEAL_HEADER);
    this.dealBtn.inputEnabled = true;
    this.dealBtn.events.onInputDown.add(() => {
      this.player.deal(this.currentDeal);
      destroy();
    });

    this.cancelBtn = this.game.add.text(200, 400, 'Refuse', STYLES.DEAL_HEADER);
    this.cancelBtn.inputEnabled = true;
    this.cancelBtn.events.onInputDown.add(() => {
      this.player.decline(this.currentDeal);
      destroy();
    });
    // this.descriptionText = this.game.add.text(MARGIN_LEFT, 150, this.currentDeal.body, STYLES.DEAL_DESCRIPTION);

    // this.descriptionText.setTextBounds(0, 150, 724, 568);
    modalGroup.addMultiple([
      bg,
      this.headerText,
      this.descriptionText,
      this.effects,
      this.dealBtn,
      this.cancelBtn
    ]);

	}

    drawDeal() {

    }

	waitForDestroy() {
		this.onDestroy.dispatch();
  }
  
}
