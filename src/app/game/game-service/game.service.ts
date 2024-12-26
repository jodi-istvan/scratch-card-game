import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {GameBet, GameHistory} from '../game.component';

export enum GameState {
  WAITING, STARTED, ENDED
}

@Injectable()
export class GameService {

  private readonly _gameHistory: GameHistory[] = [];

  public readonly gameState$: BehaviorSubject<GameState> = new BehaviorSubject<GameState>(GameState.WAITING);
  public readonly revealCards$: Subject<void> = new Subject<void>()
  public readonly balance$: BehaviorSubject<number> = new BehaviorSubject<number>(10000);
  public readonly bet$: BehaviorSubject<GameBet> = new BehaviorSubject<GameBet>(0.5);

  get gameHistory(): GameHistory[] {
    return this._gameHistory;
  }

  public addGameHistory(gameHistory: GameHistory) {
    this.gameHistory.push(gameHistory);
    if (this.gameHistory.length > 20) {
      this.gameHistory.shift();
    }
  }
}
