import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyForm } from './buy-form';

describe('BuyForm', () => {
  let component: BuyForm;
  let fixture: ComponentFixture<BuyForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
