import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldCoinsComponent } from './sold-coins.component';

describe('SoldCoinsComponent', () => {
  let component: SoldCoinsComponent;
  let fixture: ComponentFixture<SoldCoinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoldCoinsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoldCoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
