import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusAddComponent } from './syllabus-add.component';

describe('SyllabusAddComponent', () => {
  let component: SyllabusAddComponent;
  let fixture: ComponentFixture<SyllabusAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyllabusAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyllabusAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
