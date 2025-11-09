import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewuserBox } from './newuser-box';

describe('NewuserBox', () => {
  let component: NewuserBox;
  let fixture: ComponentFixture<NewuserBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewuserBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewuserBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
