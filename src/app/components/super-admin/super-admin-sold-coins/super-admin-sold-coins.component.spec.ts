import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminSoldCoinsComponent } from './super-admin-sold-coins.component';

describe('SuperAdminSoldCoinsComponent', () => {
  let component: SuperAdminSoldCoinsComponent;
  let fixture: ComponentFixture<SuperAdminSoldCoinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminSoldCoinsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperAdminSoldCoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
