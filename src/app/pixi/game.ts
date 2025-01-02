import {Application, Assets, EventEmitter} from 'pixi.js';
import {cardVariations, GameConfig} from './config';
import {TableContainer} from './containers/table-container';
import {CardBackSprite} from './sprites/card-back-sprite';
import {Card} from './interfaces/card.interface';
import {initDevtools} from '@pixi/devtools';

export class Game extends EventEmitter {

  private tableContainer!: TableContainer;
  private cards: Card[] = [];

  public bet: number = 0;
  public winningCard: Card | undefined = undefined;

  public readonly app: Application;

  constructor() {
    super();
    this.app = new Application();
  }

  public async init(canvas: HTMLCanvasElement): Promise<void> {
    await this.app.init({
      width: GameConfig.gameWidth,
      height: GameConfig.gameHeight,
      backgroundAlpha: 0,
      canvas: canvas
    });

    await initDevtools({ app: this.app });

    await Assets.load(CardBackSprite.cardBackImageUrl);

    this.tableContainer = new TableContainer(this, GameConfig.tableRows, GameConfig.tableCols, GameConfig.tableCardGap);
    this.app.stage.addChild(this.tableContainer);

    this.tableContainer.on('everyCardFlipped', () => {
      this.emit('everyCardFlipped');
    });
  }

  public flipCards(): void {
    this.tableContainer.flipCards();
  }

  public generateCardContainers(): void {
    this.tableContainer.generateCardContainers();
  }

  public generateCards(): Card[] {
    this.winningCard = undefined;
    const numberOfCards = GameConfig.tableRows * GameConfig.tableCols;
    const generatedCards: Card[] = [];
    const generatedCardsCounter: Record<number, number> = {};

    cardVariations.forEach((card) => generatedCardsCounter[card.symbol] = 0);

    while (generatedCards.length < numberOfCards) {
      const card = this.generateRandomCard();
      if (card.symbol === 0) {
        generatedCards.push(card);
      } else {
        if (generatedCardsCounter[card.symbol] < (this.winningCard ? 2 : 3)) {
          generatedCardsCounter[card.symbol]++;
          generatedCards.push(card);
        }
        if (generatedCardsCounter[card.symbol] === 3) {
          this.winningCard = card;
        }
      }
    }
    this.cards = generatedCards;
    this.tableContainer.updateCardContainersData(this.cards, this.bet);

    return generatedCards;
  }

  private generateRandomCard(): Card {
    const random = Math.ceil(Math.random() * GameConfig.deckSize);

    let weightSum = 0;
    for (let i = 0; i < cardVariations.length; i++) {
      weightSum += cardVariations[i].weight;
      if (weightSum >= random) {
        return cardVariations[i];
      }
    }

    return cardVariations[cardVariations.length - 1];
  }
}
