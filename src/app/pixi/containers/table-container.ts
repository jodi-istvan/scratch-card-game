import {Container, Graphics} from 'pixi.js';
import {CardContainer} from './card-container';
import {Card} from '../interfaces/card.interface';
import {Game} from '../game';
import {GameConfig} from '../config';

export class TableContainer extends Container {

  private readonly game: Game;
  private readonly rows: number;
  private readonly cols: number;
  private readonly gap: number;

  private cardContainers: CardContainer[] = [];
  private gameEnded: boolean = false;

  constructor(game: Game, rows: number, cols: number, gap: number) {
    super();

    this.game = game;
    this.rows = rows;
    this.cols = cols;
    this.gap = gap;
  }

  private centerTable(): void {
    const { width, height } = this.game.app.screen;

    this.x = (width - this.width) / 2;
    this.y = (height - this.height) / 2;
  }

  public updateCardContainersData(cards: Card[], bet: number): void {
    this.gameEnded = false;
    for (let i = 0; i < this.cardContainers.length; i++) {
      this.cardContainers[i].symbol = cards[i].symbol;
      this.cardContainers[i].prize = cards[i].multiplier * bet
      this.cardContainers[i].updateSymbol();
    }
  }

  public generateCardContainers(): void {
    this.removeChildren(0, this.cardContainers.length);
    this.cardContainers = [];
    for (let row = 0, cardIndex = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++, cardIndex++) {
        const cardContainer = new CardContainer();
        cardContainer.x = col * (GameConfig.cardWidth + this.gap) + GameConfig.cardWidth / 2;
        cardContainer.y = row * (GameConfig.cardHeight + this.gap) + GameConfig.cardHeight / 2;
        cardContainer.interactive = true;
        cardContainer.addFlipEventListener(this.onCardFlip.bind(this));
        cardContainer.on('cardFlipped', () => console.log(123))
        this.cardContainers.push(cardContainer);
        this.addChild(cardContainer);
      }
    }
    this.centerTable();
  }

  public flipCards(): void {
    this.cardContainers.forEach(card => {
      if (!card.isFlipped) {
        setTimeout(card.flip.bind(card), Math.floor(Math.random() * 200))
      }
    });
  }

  private onCardFlip(): void {
    const everyCardFlipped = this.cardContainers.every(card => card.isFlipped);

    if (everyCardFlipped && !this.gameEnded) {
      if (this.game.winningCard) {
        for (const card of this.cardContainers) {
          if (card.symbol === this.game.winningCard.symbol) {
            card.addWinningStyle()
          }
        }
      }
      this.emit('everyCardFlipped');
      this.gameEnded = true;
    }
  }
}
