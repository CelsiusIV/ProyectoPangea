import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesTable } from './classes-table';

describe('ClassesTable', () => {
  let component: ClassesTable;
  let fixture: ComponentFixture<ClassesTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassesTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassesTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
