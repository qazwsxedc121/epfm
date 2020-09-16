import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailRoutingModule } from './detail-routing.module';

import { DetailComponent } from './detail.component';
import { SharedModule } from '../shared/shared.module';
import { FilemanagerPanelComponent } from '../filemanager-panel/filemanager-panel.component';

import { NzModalModule } from "ng-zorro-antd/modal";

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';

import { IconDefinition } from '@ant-design/icons-angular'
import {
  DeleteOutline,
  EditOutline,
  FolderOutline,
  FileTextOutline,
  CopyOutline,
  FolderAddOutline,
  FileAddOutline,
  FormOutline,
  HomeOutline,
  CodeOutline,
  ReloadOutline,
} from '@ant-design/icons-angular/icons'

const icons: IconDefinition[] = [
  DeleteOutline,
  EditOutline,
  FolderOutline,
  FileTextOutline,
  CopyOutline,
  FolderAddOutline,
  FileAddOutline,
  FormOutline,
  HomeOutline,
  CodeOutline,
  ReloadOutline,
]


@NgModule({
  declarations: [DetailComponent, FilemanagerPanelComponent],
  imports: [
    CommonModule, SharedModule, DetailRoutingModule,
    NzModalModule,
    NzInputModule,
    NzTableModule,
    NzButtonModule,
    NzBreadCrumbModule,
    NzIconModule.forRoot(icons),
    NzGridModule,
  ]
})
export class DetailModule { }
