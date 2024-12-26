import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GameComponent} from './game.component';
import { GameControlsComponent } from './game-controls/game-controls.component';
import {GameService} from './game-service/game.service';
import { GameBetModalComponent } from './game-bet-modal/game-bet-modal.component';
import { GameResultModalComponent } from './game-result-modal/game-result-modal.component';
import { GameHistoryModalComponent } from './game-history-modal/game-history-modal.component';
import { GamePayTableModalComponent } from './game-pay-table-modal/game-pay-table-modal.component';

@NgModule({
  declarations: [
    GameComponent,
    GameControlsComponent,
    GameBetModalComponent,
    GameResultModalComponent,
    GameHistoryModalComponent,
    GamePayTableModalComponent
  ],
  exports: [
    GameComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [ GameService ],
})
export class GameModule { }
