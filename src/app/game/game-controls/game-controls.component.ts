import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {GameBetModalComponent} from '../game-bet-modal/game-bet-modal.component';
import {GameService, GameState} from '../game-service/game.service';
import {GameHistoryModalComponent} from '../game-history-modal/game-history-modal.component';
import {GamePayTableModalComponent} from '../game-pay-table-modal/game-pay-table-modal.component';
import {cardVariations, GameBet} from '../../pixi/config';

@Component({
  selector: 'app-game-controls',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game-controls.component.html',
  styleUrl: './game-controls.component.scss'
})
export class GameControlsComponent implements OnInit {

  public balance: number;
  public bet: GameBet;
  public gameState: GameState;

  protected readonly GameState = GameState;

  constructor(
    private gameService: GameService,
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
  ) {
    this.balance = this.gameService.balance$.value;
    this.bet = this.gameService.bet$.value;
    this.gameState = this.gameService.gameState$.value;
  }

  ngOnInit() {
    this.gameService.balance$.subscribe(balance => {
      this.balance = balance;
      this.cdRef.detectChanges();
    });
    this.gameService.bet$.subscribe(bet => {
      this.bet = bet
      this.cdRef.detectChanges();
    });
    this.gameService.gameState$.subscribe(gameState => {
      this.gameState = gameState;
      this.cdRef.detectChanges();
    });
  }

  protected openGameHistoryModal(): void {
    const modalRef = this.modalService.open(GameHistoryModalComponent, {
      centered: true,
      scrollable: true,
    });
    const modalRefComponent = modalRef.componentInstance as GameHistoryModalComponent;
    modalRefComponent.gameHistoryList = this.gameService.gameHistory;
  }

  protected openPayTableModal(): void {
    const modalRef = this.modalService.open(GamePayTableModalComponent, {
      centered: true,
      scrollable: true,
    });
    const modalRefComponent = modalRef.componentInstance as GamePayTableModalComponent;
    modalRefComponent.payTable = cardVariations.slice(0, cardVariations.length - 1);
    modalRefComponent.bet = this.gameService.bet$.value;
    modalRefComponent.deckSize = 50000;
  }

  protected openBetModal(): void {
    if (this.gameService.gameState$.value === GameState.WAGERED) return;

    const modalRef = this.modalService.open(GameBetModalComponent, {
      centered: true,
    });
    const modalRefComponent = modalRef.componentInstance as GameBetModalComponent;
    modalRefComponent.selectedBet = this.bet;

    modalRef.result.finally(
      () => this.gameService.bet$.next(modalRefComponent.selectedBet))
  }

  protected wager(): void {
    if (this.gameService.gameState$.value === GameState.ENDED) {
      this.gameService.gameState$.next(GameState.CARDS_PAINTED);
    }
    this.gameService.gameState$.next(GameState.WAGERED);
  }

  protected revealCards(): void {
    this.gameService.revealCards$.next();
  }

}
