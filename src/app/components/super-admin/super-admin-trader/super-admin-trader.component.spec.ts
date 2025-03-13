import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminTraderComponent } from './super-admin-trader.component';

describe('SuperAdminTraderComponent', () => {
  let component: SuperAdminTraderComponent;
  let fixture: ComponentFixture<SuperAdminTraderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminTraderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperAdminTraderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
