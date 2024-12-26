import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {GameBet, gameBetOptions} from '../game.component';
import {GameService} from '../game-service/game.service';

@Component({
  selector: 'app-game-bet-modal',
  standalone: false,
  templateUrl: './game-bet-modal.component.html',
  styleUrl: './game-bet-modal.component.scss'
})
export class GameBetModalComponent implements OnInit {

  selectedBet!: GameBet;

  public betOptions = gameBetOptions

  constructor(
    private gameService: GameService,
    private activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
  }

  close() {
    this.activeModal.close(this.selectedBet);
  }
}
