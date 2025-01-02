import { Component } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Card} from '../../pixi/interfaces/card.interface';

@Component({
  selector: 'app-game-pay-table-modal',
  standalone: false,
  templateUrl: './game-pay-table-modal.component.html',
  styleUrl: './game-pay-table-modal.component.scss'
})
export class GamePayTableModalComponent {

  public payTable: Card[] = [];
  public bet: number = 1;
  public deckSize: number = 1;

  constructor(public activeModal: NgbActiveModal) {}

  protected close() {
    this.activeModal.close();
  }
}
