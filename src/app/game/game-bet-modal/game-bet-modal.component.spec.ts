import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameBetModalComponent } from './game-bet-modal.component';

describe('GameBetModalComponent', () => {
  let component: GameBetModalComponent;
  let fixture: ComponentFixture<GameBetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameBetModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameBetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
