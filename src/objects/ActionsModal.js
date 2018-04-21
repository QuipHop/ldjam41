import Player from './Player'
import { ListView } from 'phaser-list-view';
import { STYLES } from './Styles';
import { ACTIONS } from './ActionsSheet';

export default class ActionsModal {

	constructor (game) {

		this.game = game;
		this.player = Player;
		this.openModal();
		this.onDestroy = new Phaser.Signal();
	}

	openModal(type) {

		let modalGroup = this.game.add.group();
		let bg = this.game.add.graphics(0, 0);
		bg.inputEnabled = true;
		bg.beginFill("#FFF", 0.5);
		bg.drawRect(0, 50, this.game.world.width, this.game.world.height - 50);
		// this.cartLabel = this.game.add.text(10, 5, '', STYLES.MAIN); 

		modalGroup.addMultiple([bg]);

		let bounds = new Phaser.Rectangle(0, 110, this.game.world.width, this.game.world.height - 50);
		let options = {
			direction: 'y',
			overflow: 50,
			padding: 10
		};

		let listView = new ListView(this.game, modalGroup, bounds, options);
		this.drawShop(listView, options.padding);
		// modalGroup.add(listView);

		this.game.world.bringToTop(bg);

		let backTxt = this.game.add.text(this.game.world.width - 10, 5, 'X', STYLES.MAIN); 
		backTxt.anchor.setTo(1, 0);
		backTxt.inputEnabled = true;
		backTxt.events.onInputDown.add(() => {
			backTxt.destroy();
			modalGroup.destroy(true);
			this.waitForDestroy();
		});
	}

	drawShop(listView, padding) {

		ACTIONS.forEach((item) => {
			let img = this.game.add.image(0, 0, 'btn_empty_md');
			img.height = 130;
			img.width = this.game.world.width;
      img.itemPrice = item.price;
      const txt = img.addChild(
				this.game.add.text(10 , img.centerY / 2, `${item.label}\n`, STYLES.ACTIONS)
			);
      txt.anchor.setTo(0, 0.5);
      const actionBtn = this.game.add.text(
				250,
				25,
				'BUY',
				STYLES.ACTIONS
			);
      img.addChild(actionBtn);
      // actionBtn.anchor.setTo(1, 0.5);
      // actionBtn.lineSpacing = img.height;
      txt.setTextBounds(0, 0, img.width / 4, img.height);
			actionBtn.inputEnabled = true;
			actionBtn.input.priorityID = 9999;
			actionBtn.events.onInputDown.add(() => {
        this.player.buy(item);
        this.checkDisabledActionButtons(listView);
      });
      listView.add(img);
      // actionBtn.alignIn(img, Phaser.CENTER_RIGHT);
    });
    
    this.player.onIncrease.add(() => {
      this.checkDisabledActionButtons(listView);
    });
    this.checkDisabledActionButtons(listView);
	}

	checkDisabledActionButtons(listView) {
		listView.items.forEach((block) => {
			if (this.player.money < block.itemPrice) {
				block.children[1].inputEnabled = false;
				block.children[1].alpha = 0.5;
			} else {
        block.children[1].alpha = 1;
				block.children[1].inputEnabled = true;
			}
		});
	}

	waitForDestroy() {
		this.onDestroy.dispatch();
	}
}
