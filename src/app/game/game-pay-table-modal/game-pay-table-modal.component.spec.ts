import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePayTableModalComponent } from './game-pay-table-modal.component';

describe('GamePayTableModalComponent', () => {
  let component: GamePayTableModalComponent;
  let fixture: ComponentFixture<GamePayTableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GamePayTableModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamePayTableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
