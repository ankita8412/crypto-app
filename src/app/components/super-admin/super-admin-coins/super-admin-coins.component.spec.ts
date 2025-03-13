import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminCoinsComponent } from './super-admin-coins.component';

describe('SuperAdminCoinsComponent', () => {
  let component: SuperAdminCoinsComponent;
  let fixture: ComponentFixture<SuperAdminCoinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminCoinsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperAdminCoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
