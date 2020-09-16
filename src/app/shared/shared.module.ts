import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { TextDialogComponent } from './components/'
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';

import { NzModalModule } from "ng-zorro-antd/modal";
import { NzInputModule } from 'ng-zorro-antd/input';
import { FilesizePipe } from './filesize.pipe';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective,
    TextDialogComponent,
    FilesizePipe,
  ],
  imports: [CommonModule, TranslateModule, FormsModule,
    NzModalModule,
    NzInputModule,
  ],
  exports: [TranslateModule, WebviewDirective, FormsModule,
    TextDialogComponent,
    FilesizePipe,
  ],
})
export class SharedModule { }
