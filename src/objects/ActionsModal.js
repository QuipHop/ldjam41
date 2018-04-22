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
		this.cashSound = this.game.add.audio('cash');
	}

	openModal(type) {

		let modalGroup = this.game.add.group();
		let bg = this.game.add.graphics(0, 0);
		// bg.inputEnabled = true;
		bg.beginFill("#FFF", 0.5);
		bg.drawRect(0, 100, this.game.world.width, this.game.world.height - 50);

		modalGroup.addMultiple([bg]);

		let bounds = new Phaser.Rectangle(0, 110, this.game.world.width, this.game.world.height - 50);
		let options = {
			direction: 'y',
			overflow: 50,
			padding: 10,
			searchForClicks: true,
			autocull: false
		};

		let listView = new ListView(this.game, modalGroup, bounds, options);
		this.drawShop(listView, options.padding);
		// modalGroup.add(listView);

		this.game.world.bringToTop(bg);

		let backTxt = this.game.add.text(this.game.world.width - 20, 20, 'X', STYLES.CLOSE_BTN); 
		backTxt.anchor.setTo(1, 0);
		backTxt.inputEnabled = true;
		backTxt.events.onInputDown.add(() => {
			backTxt.destroy();
      modalGroup.destroy(true);
      this.game.input.mouse.mouseWheelCallback = null;
      this.increaseHandler.detach();
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
				this.game.add.text(10 , img.centerY / 2 + 10, `${item.label}\nprice: $${item.price}`, STYLES.ACTIONS)
			);
      txt.anchor.setTo(0, 0.5);
      const actionBtn = this.game.add.text(
				270,
				25,
				'BUY',
				STYLES.ACTIONS
			);
      img.addChild(actionBtn);
      // actionBtn.anchor.setTo(1, 0.5);
      // actionBtn.lineSpacing = img.height;
      txt.setTextBounds(0, 0, img.width / 4, img.height);
			img.inputEnabled = true;
			img.input.priorityID = 9999;
			img.events.onInputDown.add(() => {
				this.player.buy(item);
				if (!this.cashSound.isPlaying) this.cashSound.play();
        this.checkDisabledActionButtons(listView);
      });
      listView.add(img);
      // actionBtn.alignIn(img, Phaser.CENTER_RIGHT);
    });

    let index = 0;
    this.game.input.mouse.mouseWheelCallback = (evt) => {
      if(this.game.input.mouse.wheelDelta === Phaser.Mouse.WHEEL_UP) {
        if (index - 1 >= 0) --index;
      } else {
        if (index + 1 <= ACTIONS.length - 4) ++index;
      }
      listView.tweenToItem(index, 1);
    };

    this.increaseHandler = this.player.onIncrease.add(() => {
      this.checkDisabledActionButtons(listView);
    });
    this.checkDisabledActionButtons(listView);
	}

	checkDisabledActionButtons(listView) {
		listView.items.forEach((block) => {
			if (this.player.money < block.itemPrice) {
				block.inputEnabled = false;
				block.input.useHandCursor = true;
				block.alpha = 0.85;
			} else {
				block.alpha = 1;
				block.inputEnabled = true;
				block.input.useHandCursor = false;
			}
		});
	}

	waitForDestroy() {
		this.onDestroy.dispatch();
	}
}
