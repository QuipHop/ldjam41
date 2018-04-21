/**
 * Setup and control base player.
 */
const INCREASE_TIMEOUT = 1000;

class Player  {
  
  constructor() {
    this.money = 100;
    this.believers = 0;
    this.moneyIncrease = 0;
    this.onIncrease = new Phaser.Signal();
    this.runIncreaseLoop();
  }

  buy(item) {
    this.believers += item.increase;
    this.money -= item.price;
    this.moneyLabel.setText(`$${this.money}`);
    this.believersLabel.setText(`/${this.believers}`);
  }

  runIncreaseLoop() {
    if(this.moneyLabel && this.believersLabel) {
      this.increaseInterval = setInterval(() => {
        this.money += this.believers;
        this.moneyLabel.setText(`$${this.money}`);
        this.onIncrease.dispatch();
      }, INCREASE_TIMEOUT)
    }
  }


  bindLabels(believersLabel, moneyLabel) {
    this.believersLabel = believersLabel;
    this.moneyLabel = moneyLabel;
  }
}

export default new Player(window.game);
