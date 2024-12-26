import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {Application, Container, ContainerChild,} from 'pixi.js';
import {Card} from './pixi-components/card';
import {GameService, GameState} from './game-service/game.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {filter} from 'rxjs';
import {GameResultModalComponent} from './game-result-modal/game-result-modal.component';

export interface CardData {
  symbol: number;
  weight: number;
  multiplier: number;
}

export interface GameHistory {
  time: Date;
  bet: number;
  symbols: number[];
  won: number;
}

export type GameBet = 0.1 | 0.25 | 0.5 | 1 | 2;
export const gameBetOptions: GameBet[] = [ 0.1, 0.25, 0.5, 1, 2 ]

export const cardDataList: CardData[] = [
  { symbol: 9, weight: 1, multiplier: 10000 },
  { symbol: 8, weight: 4, multiplier: 2000 },
  { symbol: 7, weight: 10, multiplier: 400 },
  { symbol: 6, weight: 25, multiplier: 200 },
  { symbol: 5, weight: 50, multiplier: 50 },
  { symbol: 4, weight: 200, multiplier: 10 },
  { symbol: 3, weight: 400, multiplier: 5 },
  { symbol: 2, weight: 2000, multiplier: 2 },
  { symbol: 1, weight: 10000, multiplier: 1 },
  { symbol: 0, weight: 37310, multiplier: 0 }
];

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnInit, OnDestroy {

  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef;

  private readonly app: Application = new Application();
  private readonly cards: Card[] = [];
  private readonly appBackgroundColor = '#9bbd7a'

  public readonly gameWidth = 800;
  public readonly gameHeight = 800;

  private readonly cardWidth = 175 * 0.7;
  private readonly cardHeight = 250 * 0.7;

  private readonly deckSize = 50000;

  private winningCardData: CardData | undefined = undefined;

  constructor(
    private gameService: GameService,
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    await this.app.init({ width: this.gameWidth, height: this.gameHeight, backgroundColor: this.appBackgroundColor });
    this.gameContainer.nativeElement.appendChild(this.app.canvas);

    const table = this.createTable();
    this.app.stage.addChild(table);

    this.generateCardGraphics().forEach(card => {
      this.cards.push(card);
      table.addChild(card);
    })

    this.gameService.gameState$
      .pipe(filter(gameState => gameState === GameState.WAITING))
      .subscribe()

    this.gameService.gameState$
      .pipe(filter(gameState => gameState === GameState.STARTED))
      .subscribe(() => {
        this.winningCardData = undefined;
        table.removeChild(...this.cards);
        this.cards.splice(0, this.cards.length);
        this.generateCardGraphics().forEach(card => {
          this.cards.push(card);
          table.addChild(card);
        })

        this.gameService.balance$.next(this.gameService.balance$.value - this.gameService.bet$.value);
        this.cards.forEach(card => card.interactive = true);
        this.cdRef.detectChanges();
      });

    this.gameService.gameState$
      .pipe(filter(gameState => gameState === GameState.ENDED))
      .subscribe(() => {
        const amountWon = this.gameService.bet$.value * (this.winningCardData?.multiplier || 0)
        this.gameService.balance$.next(this.gameService.balance$.value + amountWon);
        const gameHistory: GameHistory = {
          time: new Date(),
          bet: this.gameService.bet$.value,
          symbols: this.cards.map(card => card.symbol),
          won: amountWon,
        }
        this.gameService.addGameHistory(gameHistory);
        this.openGameResultModal();
        this.cdRef.detectChanges();
      });

    this.gameService.revealCards$.subscribe(() => {
      this.cards.forEach(card =>
        setTimeout(card.flip.bind(card), this.generateCardFlipTimeout()));
    });
  }

  generateCardFlipTimeout(): number {
    return Math.floor(Math.random() * 200);
  }

  ngOnDestroy() {
    /**
     * Unsubscribe
     */
  }

  private generateRandomCard(): CardData {
    const random = Math.ceil(Math.random() * this.deckSize);

    let weightSum = 0;
    for (let i = 0; i < cardDataList.length; i++) {
      weightSum += cardDataList[i].weight;
      if (weightSum >= random) {
        return cardDataList[i];
      }
    }

    return cardDataList[cardDataList.length - 1];
  }

  // TODO: Instead of generating new cards every time, just clear the graphics and change the number
  private generateCardGraphics(): Card[] {
    const rows = 3;
    const cols = 3;
    const cardMargin = 10;

    const cardGraphicsList: Card[] = [];
    const cards = this.generateCards();

    for (let row = 0, cardIndex = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++, cardIndex++) {
        const card = new Card(
          cards[cardIndex].symbol,
          cards[cardIndex].multiplier * this.gameService.bet$.value,
          this.cardWidth,
          this.cardHeight
        );
        card.x = col * (this.cardWidth + cardMargin) + this.cardWidth / 2;
        card.y = row * (this.cardHeight + cardMargin) + this.cardHeight / 2;
        card.addFlipEventListener(this.onCardFlip.bind(this));
        cardGraphicsList.push(card);
      }
    }

    return cardGraphicsList;
  }

  private generateCards(): Array<CardData> {
    const generatedCards: Array<CardData> = [];
    const generatedCardsCounter: Record<number, number> = {};
    cardDataList.forEach((card) => generatedCardsCounter[card.symbol] = 0);

    while (generatedCards.length < 9) {
      const card = this.generateRandomCard();
      if (card.symbol === 0) {
        generatedCards.push(card);
      } else {
        if (generatedCardsCounter[card.symbol] < (this.winningCardData ? 2 : 3)) {
          generatedCardsCounter[card.symbol]++;
          generatedCards.push(card);
        }
        if (generatedCardsCounter[card.symbol] === 3) {
          this.winningCardData = card;
        }
      }
    }

    return generatedCards;
  }

  private createTable(): Container {
    const rows = 3;
    const cols = 3;
    const cardMargin = 10;

    const tableContainer = new Container();
    tableContainer.x = this.app.screen.width / 2 - ((cols * this.cardWidth + (cols - 1) * cardMargin) / 2);
    tableContainer.y = this.app.screen.height / 2 - ((rows * this.cardHeight + (rows - 1) * cardMargin) / 2);

    return tableContainer;
  }

  private openGameResultModal(): void {
    const modalRef = this.modalService.open(GameResultModalComponent, {
      centered: true,
    });
    const modalRefComponent = modalRef.componentInstance as GameResultModalComponent;

    modalRefComponent.amountWon = this.winningCardData ? this.gameService.bet$.value * this.winningCardData.multiplier : undefined;

    modalRef.result.finally(() => this.gameService.gameState$.next(GameState.WAITING));
  }

  public onCardFlip(): void {
    console.log(this.cards)
    console.log(this.winningCardData)
    const everyCardFlipped = this.cards.every(card => card.isFlipped);
    if (everyCardFlipped && this.gameService.gameState$.value !== GameState.ENDED) {
      if (this.winningCardData) {
        for (const card of this.cards) {
          if (card.symbol === this.winningCardData.symbol) {
            card.addWinningStyle()
          }
        }
      } else {
        /**
         * Handle lose case
         */
      }
      this.gameService.gameState$.next(GameState.ENDED);
    }
  }

}
