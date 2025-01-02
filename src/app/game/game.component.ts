import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {GameService, GameState} from './game-service/game.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {filter, Subscription} from 'rxjs';
import {GameResultModalComponent} from './game-result-modal/game-result-modal.component';
import {Game} from '../pixi/game';
import {Card} from '../pixi/interfaces/card.interface';
import {GameHistory} from '../pixi/interfaces/game-history.interface';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef;

  private cards: Card[] = [];
  private winningCard: Card | undefined = undefined;

  private readonly game: Game = new Game();
  private readonly subscriptions: Subscription[] = [];

  constructor(
    private gameService: GameService,
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
  ) {}

  async ngAfterViewInit() {
    await this.game.init(this.gameContainer.nativeElement);

    this.game.on('everyCardFlipped', () => {
      this.gameService.gameState$.next(GameState.ENDED);
    });

    const gameCardsDealtSub = this.gameService.gameState$
      .pipe(filter(gameState => gameState === GameState.CARDS_PAINTED))
      .subscribe(() => {
        this.game.generateCardContainers();
      });

    const gameWageredSub = this.gameService.gameState$
      .pipe(filter(gameState => gameState === GameState.WAGERED))
      .subscribe(() => {
        this.cards = this.game.generateCards();
        this.winningCard = this.game.winningCard;
        this.gameService.balance$.next(this.gameService.balance$.value - this.gameService.bet$.value);
        this.cdRef.detectChanges();
      });

    const gameEndedSub = this.gameService.gameState$
      .pipe(filter(gameState => gameState === GameState.ENDED))
      .subscribe(() => {
        const amountWon = this.gameService.bet$.value * (this.winningCard?.multiplier || 0)
        this.gameService.balance$.next(this.gameService.balance$.value + amountWon);

        const gameHistory: GameHistory = this.generateGameHistory(amountWon);
        this.gameService.addGameHistory(gameHistory);

        this.openGameResultModal();
        this.cdRef.detectChanges();
      });

    const revealCardsSub = this.gameService.revealCards$.subscribe(() => {
      this.game.flipCards();
    });

    const betSub = this.gameService.bet$.subscribe(bet => {
      this.game.bet = bet;
    })

    this.subscriptions.push(gameCardsDealtSub, gameWageredSub, gameEndedSub, revealCardsSub, betSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private generateGameHistory(amountWon: number): GameHistory {
    return {
      time: new Date(),
      bet: this.gameService.bet$.value,
      symbols: this.cards.map(card => card.symbol),
      won: amountWon,
    }
  }

  private openGameResultModal(): void {
    const modalRef = this.modalService.open(GameResultModalComponent, {
      centered: true,
    });
    const modalRefComponent = modalRef.componentInstance as GameResultModalComponent;

    modalRefComponent.amountWon = this.winningCard ? this.gameService.bet$.value * this.winningCard.multiplier : undefined;
  }

}
