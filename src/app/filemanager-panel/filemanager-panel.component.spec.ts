import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilemanagerPanelComponent } from './filemanager-panel.component';

describe('FilemanagerPanelComponent', () => {
  let component: FilemanagerPanelComponent;
  let fixture: ComponentFixture<FilemanagerPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilemanagerPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilemanagerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
