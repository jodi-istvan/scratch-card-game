import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {GameHistory} from '../../pixi/interfaces/game-history.interface';
import {GameBet} from '../../pixi/config';

export enum GameState {
  CARDS_PAINTED, WAGERED, ENDED
}

@Injectable()
export class GameService {

  private readonly _gameHistory: GameHistory[] = [];

  public readonly gameState$: BehaviorSubject<GameState> = new BehaviorSubject<GameState>(GameState.CARDS_PAINTED);
  public readonly revealCards$: Subject<void> = new Subject<void>()
  public readonly balance$: BehaviorSubject<number> = new BehaviorSubject<number>(10000);
  public readonly bet$: BehaviorSubject<GameBet> = new BehaviorSubject<GameBet>(0.5);

  get gameHistory(): GameHistory[] {
    return this._gameHistory;
  }

  public addGameHistory(gameHistory: GameHistory) {
    this.gameHistory.unshift(gameHistory);
    if (this.gameHistory.length > 20) {
      this.gameHistory.pop();
    }
  }
}
