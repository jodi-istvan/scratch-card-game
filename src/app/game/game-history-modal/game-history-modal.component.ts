import { Component } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {GameHistory} from '../../pixi/interfaces/game-history.interface';

@Component({
  selector: 'app-game-history-modal',
  standalone: false,
  templateUrl: './game-history-modal.component.html',
  styleUrl: './game-history-modal.component.scss'
})
export class GameHistoryModalComponent {

  public gameHistoryList: GameHistory[] = [];

  constructor(public activeModal: NgbActiveModal) {}

  protected close() {
    this.activeModal.close();
  }
}
