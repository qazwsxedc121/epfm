import { Component, OnInit, ChangeDetectorRef, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { ElectronService } from "../core/services/electron/electron.service";
import { TextDialogComponent, TextDialogResult, TextDialogInputModel, InputType } from 'app/shared/components';
import { FileDescription } from "../file-description"

@Component({
  selector: 'app-filemanager-panel',
  templateUrl: './filemanager-panel.component.html',
  styleUrls: ['./filemanager-panel.component.scss']
})
export class FilemanagerPanelComponent implements OnInit {
  constructor(
    private electornService: ElectronService,
    private changeRef: ChangeDetectorRef,
  ) { }
  public isElectron: boolean = true;
  public currentFLength: number = 0;
  public pathSect = [];
  @Input() public basePath: string;
  public isVisible: boolean = false;
  public newFileName: string = "";
  public newFileContent: string = "";

  public currentFileList: Array<FileDescription> = [];
  public currentDirectoryList: Array<FileDescription> = [];
  public fsWatcher: any;

  @Output() moveEvent = new EventEmitter<string>();

  get currentPath(): string {
    var s = this.basePath + "/";
    for (var i = 0; i < this.pathSect.length; i += 1) {
      s += this.pathSect[i] + "/";
    }
    return s;
  }

  ngOnInit(): void {
    this.isElectron = this.electornService.isElectron;
    if (!this.isElectron) return;
    this.updatePath();

  }
  dirContextMenu: any;
  fileContextMenu: any;
  initContextMenu(): void {

  }
  onContextMenu(dirname): void {
    this.dirContextMenu = new this.electornService.remote.Menu();
    this.dirContextMenu.append(new this.electornService.remote.MenuItem({
      label: `[${dirname}]`,
      click: () => {
        this.goPath(dirname);
      }
    }));
    this.dirContextMenu.append(new this.electornService.remote.MenuItem({
      label: `copy full path`,
      click: () => {
        this.electornService.clipboard.writeText(this.currentPath + dirname);
      }
    }));
    this
    this.dirContextMenu.popup({ window: this.electornService.remote.getCurrentWindow() });

  }
  goHome(): void {
    if (this.pathSect.length > 0) {
      this.pathSect = [];
      this.updatePath();
    }
  }
  goBreadcrumbPath(idx: number): void {
    this.pathSect.splice(idx + 1, this.pathSect.length - idx - 1);
    this.updatePath();
  }
  goPath(dirname: string): void {
    if (dirname == ".." && this.pathSect.length > 0) {
      this.pathSect.splice(this.pathSect.length - 1, 1);
    } else {
      this.pathSect.push(dirname);
    }
    this.updatePath();
  }
  updatePath(): void {
    this.electornService.listDir(this.currentPath).subscribe((fDescList: Array<FileDescription>) => {
      this.currentFileList = fDescList.filter(m => m.isFile);
      if (this.pathSect.length > 0) {
        this.currentDirectoryList = [{ name: "..", ctime: new Date(), size: 0, isFile: false },];
      } else {
        this.currentDirectoryList = [];
      }
      let DirList = fDescList.filter(m => !m.isFile);
      this.currentDirectoryList.push(...DirList);
      this.refreshWatchFunc();
      this.changeRef.detectChanges();
    });
  }
  refreshWatchFunc(): void {
    console.log("start watch");
    if (this.fsWatcher) {
      this.fsWatcher.close();
    }
    this.fsWatcher = this.electornService.fs.watch(this.currentPath, (eventname, filename) => {
      console.log(`path change detected! ${eventname} ${filename}`);
      this.updatePath();
    });

  }

  delFile(fname): void {
    this.electornService.fs.unlinkSync(this.currentPath + fname);
    this.updatePath();
  }
  dupFile(fname: string): void {
    this.electornService.duplicateFile(this.currentPath, fname).subscribe(() => {
      this.updatePath();
    });
  }
  delDir(fname: string): void {
    this.electornService.removeDir(this.currentPath + fname).subscribe(() => {
      this.updatePath();
    });
  }
  @ViewChild("modal1") createTextFileDialog: TextDialogComponent;
  createTextFile(): void {
    let inputModels = [
      new TextDialogInputModel(InputType.LineText),
      new TextDialogInputModel(InputType.TextArea),
    ];
    this.createTextFileDialog.showDialog(inputModels);
  }
  @ViewChild("modal2") createDirectoryDialog: TextDialogComponent;
  createDirectory(): void {
    let inputModels = [
      new TextDialogInputModel(InputType.LineText),
    ];
    this.createDirectoryDialog.showDialog(inputModels);
  }

  @ViewChild("modal3") renameDirDialog: TextDialogComponent;
  renameDir(fname: string): void {
    let inputModels = [
      new TextDialogInputModel(InputType.LineText, fname),
    ];
    console.log('rename dir');
    this.renameDirDialog.showDialog(inputModels);
  }

  @ViewChild("modal4") renameFileDialog: TextDialogComponent;
  renameFile(fname: string): void {
    let inputModels = [
      new TextDialogInputModel(InputType.LineText, fname),
    ];
    console.log('rename file');
    this.renameFileDialog.showDialog(inputModels);
  }

  @ViewChild("modal5") editFileDialog: TextDialogComponent;
  editFile(fname: string): void {
    this.electornService.readFile(this.currentPath + fname).subscribe((content: string) => {
      let inputModels = [
        new TextDialogInputModel(InputType.TextArea, content),
      ];
      this.editFileDialog.showDialog(inputModels, { 'filepath': this.currentPath + fname });
    });
  }

  handleMakeDir(event: TextDialogResult): void {
    this.electornService.makeDir(this.currentPath + event.value[0].value).subscribe(
      (newDirPath) => {
        console.log(`makeDir finished ${newDirPath}`);
        this.updatePath();
      }
    )
  }
  handleNewFile(event: TextDialogResult): void {
    this.electornService.createFile(this.currentPath + event.value[0].value, event.value[1].value).subscribe(
      (newTextPath) => {
        console.log(`createFile finished ${newTextPath}`);
        this.updatePath();
      }
    )
  }
  handleRenameDir(event: TextDialogResult): void {
    if (event.value[0].defaultValue == event.value[0].value) return;
    this.electornService.renameDir(this.currentPath + event.value[0].defaultValue, this.currentPath + event.value[0].value).subscribe(
      (newDirName) => {
        console.log(`renameDir finished ${newDirName}`);
        this.updatePath();
      }
    )
  }
  handleRenameFile(event: TextDialogResult): void {
    if (event.value[0].defaultValue == event.value[0].value) return;
    this.electornService.renameDir(this.currentPath + event.value[0].defaultValue, this.currentPath + event.value[0].value).subscribe(
      (newFileName) => {
        console.log(`renameFile finished ${newFileName}`);
        this.updatePath();
      }
    )
  }
  handleEditFile(event: TextDialogResult): void {
    if (event.value[0].defaultValue == event.value[0].value) return;
    let path = event.context['filepath'];
    this.electornService.writeFile(path, event.value[0].value).subscribe(
      (filename) => {
        console.log(`renameFile finished ${filename}`);
        this.updatePath();
      }
    )

  }
  startTerminal(): void {
    this.electornService.startPowershell(this.currentPath, []);
  }
  moveToOpposite(dir: boolean, fname: string): void {
    console.log("move to");
    this.moveEvent.emit(this.currentPath + fname);
    setTimeout(() => {
      this.updatePath()
    }, 500
    );
  }
  public onMoveFrom(path: string): void {
    console.log("on move from " + path + "to" + this.currentPath);
    let basename = this.electornService.path.basename(path);
    let dirname = this.electornService.path.dirname(path);
    if (dirname == this.currentPath) {
      console.log("same directory");
      return;
    }
    let stat = this.electornService.fs.statSync(path)
    if (stat.isFile()) {
      this.electornService.renameFile(path, this.currentPath + basename).subscribe(() => {
        this.updatePath();
      });
    } else {
      this.electornService.renameDir(path, this.currentPath + basename).subscribe(() => {
        this.updatePath();
      });
    }

  }
  openFileWithDefault(filename: string): void {
    this.electornService.openFileWithDefault(this.currentPath + filename);
  }

}
