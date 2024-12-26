import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCoinsComponent } from './admin-coins.component';

describe('AdminCoinsComponent', () => {
  let component: AdminCoinsComponent;
  let fixture: ComponentFixture<AdminCoinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCoinsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
