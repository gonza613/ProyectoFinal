import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaOperadorComponent } from './agenda-operador.component';

describe('AgendaOperadorComponent', () => {
  let component: AgendaOperadorComponent;
  let fixture: ComponentFixture<AgendaOperadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgendaOperadorComponent]
    });
    fixture = TestBed.createComponent(AgendaOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
