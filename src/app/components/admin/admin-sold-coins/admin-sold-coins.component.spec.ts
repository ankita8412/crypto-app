import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSoldCoinsComponent } from './admin-sold-coins.component';

describe('AdminSoldCoinsComponent', () => {
  let component: AdminSoldCoinsComponent;
  let fixture: ComponentFixture<AdminSoldCoinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSoldCoinsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSoldCoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
