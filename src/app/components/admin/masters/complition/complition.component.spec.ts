import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplitionComponent } from './complition.component';

describe('ComplitionComponent', () => {
  let component: ComplitionComponent;
  let fixture: ComponentFixture<ComplitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplitionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
