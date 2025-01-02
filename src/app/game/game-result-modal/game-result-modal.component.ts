import { Component } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-game-result-modal',
  standalone: false,
  templateUrl: './game-result-modal.component.html',
  styleUrl: './game-result-modal.component.scss'
})
export class GameResultModalComponent {

  public amountWon: number | undefined;

  constructor(public activeModal: NgbActiveModal) {}

  protected close() {
    this.activeModal.close(this.amountWon);
  }
}


