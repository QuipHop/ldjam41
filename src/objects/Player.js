/**
 * Setup and control base player.
 */
const INCREASE_TIMEOUT = 1000;

class Player  {
  
  constructor() {
    this.money = 90;
    this.believers = 0;
    this.moneyIncrease = 0;
    this.lvl = 1;
    this.onIncrease = new Phaser.Signal();
  }

  buy(item) {
    this.believers += item.increase;
    this.money -= item.price;
    this.moneyLabel.setText(`$${this.money}`);
    this.believersLabel.setText(`/${this.believers}`);

    if (item.lvl > this.lvl) {
      this.lvl = item.lvl;
    } 
  }

  deal(offer) {
    this.believers = this.believers - offer.decrese > 0 ? this.believers - offer.decrese : 0;
    this.money += offer.reward;
    this.moneyLabel.setText(`$${this.money}`);
    this.believersLabel.setText(`/${this.believers}`);
  }

  decline(offer) {
    console.log('decline', offer);
  }

  runIncreaseLoop() {
    if(this.moneyLabel && this.believersLabel) {
      setInterval(() => {
        this.money += this.believers;
        this.moneyLabel.setText(`$${this.money}`);
        this.onIncrease.dispatch();
      }, INCREASE_TIMEOUT)
    }
  }

  preach() {
    this.believers++;
    this.moneyLabel.setText(`$${this.money}`);
  }

  bindLabels(believersLabel, moneyLabel) {
    this.believersLabel = believersLabel;
    this.moneyLabel = moneyLabel;
    this.runIncreaseLoop();
  }
}

export default new Player(window.game);
