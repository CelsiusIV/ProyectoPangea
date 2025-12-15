import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUsersInClass } from './list-users-in-class';

describe('ListUsersInClass', () => {
  let component: ListUsersInClass;
  let fixture: ComponentFixture<ListUsersInClass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListUsersInClass]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListUsersInClass);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
