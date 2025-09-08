import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeScanner } from './resume-scanner';

describe('ResumeScanner', () => {
  let component: ResumeScanner;
  let fixture: ComponentFixture<ResumeScanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeScanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeScanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
