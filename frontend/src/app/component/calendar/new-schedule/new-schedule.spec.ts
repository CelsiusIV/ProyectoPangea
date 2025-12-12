import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSchedule } from './new-schedule';

describe('NewSchedule', () => {
  let component: NewSchedule;
  let fixture: ComponentFixture<NewSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSchedule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
