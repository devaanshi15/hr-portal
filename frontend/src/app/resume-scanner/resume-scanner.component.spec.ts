import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeScannerComponent } from './resume-scanner.component';

describe('ResumeScannerComponent', () => {
  let component: ResumeScannerComponent;
  let fixture: ComponentFixture<ResumeScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeScannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
