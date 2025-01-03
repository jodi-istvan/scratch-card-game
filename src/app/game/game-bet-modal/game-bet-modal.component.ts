import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {GameBet, gameBetOptions} from '../../pixi/config';

@Component({
  selector: 'app-game-bet-modal',
  standalone: false,
  templateUrl: './game-bet-modal.component.html',
  styleUrl: './game-bet-modal.component.scss'
})
export class GameBetModalComponent {

  public selectedBet!: GameBet;
  public betOptions = gameBetOptions

  constructor(
    private activeModal: NgbActiveModal
  ) {}

  protected close(): void {
    this.activeModal.close(this.selectedBet);
  }
}
