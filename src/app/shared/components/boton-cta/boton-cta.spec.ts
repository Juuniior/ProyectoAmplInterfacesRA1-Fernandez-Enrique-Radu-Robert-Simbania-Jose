import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BotonCta } from './boton-cta';

describe('BotonCta', () => {
  let component: BotonCta;
  let fixture: ComponentFixture<BotonCta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonCta],
    }).compileComponents();

    fixture = TestBed.createComponent(BotonCta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
