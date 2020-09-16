import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export class TextDialogResult {
  ok: boolean = false;
  value: Array<TextDialogInputModel>;
  context: any;
}

export enum InputType {
  LineText,
  TextArea,

}

export class TextDialogInputModel {
  inputType: InputType;
  defaultValue = "";
  value = "";
  constructor(inputType: InputType, defaultValue?: string) {
    this.inputType = inputType;
    if (defaultValue) {
      this.defaultValue = defaultValue;
      this.value = defaultValue;
    }
  }
}

@Component({
  selector: 'app-text-dialog',
  templateUrl: './text-dialog.component.html',
  styleUrls: ['./text-dialog.component.scss']
})
export class TextDialogComponent implements OnInit {

  inputTypeEnum = InputType;
  constructor(
    private changeRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }
  refresh(inputModels: Array<TextDialogInputModel>): void {
    this.models = [];
    for (let i of inputModels) {
      this.models.push(i);
    }
  }
  @Input('title') dialogTitle: string;
  @Output('finish') finish = new EventEmitter<TextDialogResult>();

  public isVisible: boolean = false;
  public models: Array<TextDialogInputModel>;
  public context: any;

  showDialog(inputModels: Array<TextDialogInputModel>, context?: any): void {
    this.refresh(inputModels);
    this.isVisible = true;
    this.context = context;
    // console.log(`modal open! ${this.isVisible}`);
    this.changeRef.detectChanges();
  }

  _handleOk(): void {
    const res = new TextDialogResult();
    res.ok = true;
    res.value = this.models;
    res.context = this.context;
    this.finish.emit(res);
    this.isVisible = false;
    this.changeRef.detectChanges();
    // console.log(`modal ok! ${this.isVisible}`);
  }
  _handleCancel(): void {
    this.isVisible = false;
    this.changeRef.detectChanges();
    // console.log(`modal cancel! ${this.isVisible}`);
  }
  trackByFn(index: number, name): number {
    return index;
  }

}
