import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTargetComponent } from './admin-target.component';

describe('AdminTargetComponent', () => {
  let component: AdminTargetComponent;
  let fixture: ComponentFixture<AdminTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminTargetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
