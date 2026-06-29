import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeccionPage } from './leccion.page';

describe('LeccionPage', () => {
  let component: LeccionPage;
  let fixture: ComponentFixture<LeccionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LeccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
