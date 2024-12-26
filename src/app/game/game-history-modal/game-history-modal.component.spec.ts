import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameHistoryModalComponent } from './game-history-modal.component';

describe('GameHistoryModalComponent', () => {
  let component: GameHistoryModalComponent;
  let fixture: ComponentFixture<GameHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameHistoryModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
