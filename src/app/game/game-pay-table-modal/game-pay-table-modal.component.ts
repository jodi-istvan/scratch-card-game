import { Component } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CardData, cardDataList} from '../game.component';

@Component({
  selector: 'app-game-pay-table-modal',
  standalone: false,
  templateUrl: './game-pay-table-modal.component.html',
  styleUrl: './game-pay-table-modal.component.scss'
})
export class GamePayTableModalComponent {

  public payTable: CardData[] = [];
  public bet: number = 1;
  public deckSize: number = 1;

  constructor(public activeModal: NgbActiveModal) {}

  close() {
    this.activeModal.close();
  }
}
