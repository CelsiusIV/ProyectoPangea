import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClassDialog } from './edit-class-dialog';

describe('EditClassDialog', () => {
  let component: EditClassDialog;
  let fixture: ComponentFixture<EditClassDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditClassDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditClassDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
