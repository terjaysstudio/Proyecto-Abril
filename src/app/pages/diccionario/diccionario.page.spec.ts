import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiccionarioPage } from './diccionario.page';

describe('DiccionarioPage', () => {
  let component: DiccionarioPage;
  let fixture: ComponentFixture<DiccionarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiccionarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
