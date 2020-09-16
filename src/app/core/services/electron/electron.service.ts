import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote, clipboard, shell } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { Observable, observable, fromEventPattern } from 'rxjs';
import { FileDescription } from 'app/file-description';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  path: typeof path;
  clipboard: typeof clipboard;
  shell: typeof shell;

  contextMenu: any;
  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;
      this.clipboard = window.require('electron').clipboard;
      this.shell = window.require('electron').shell;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.path = window.require('path');
    }
  }

  makeDir(path: string): Observable<string> {
    const res = new Observable<string>((observer) => {
      console.log('mkdir start')
      this.fs.mkdir(path, () => {
        console.log('mkdir cb');
        observer.next(path);
        observer.complete();
      })
    })
    return res;
  }
  createFile(path: string, content: string): Observable<string> {
    const res = new Observable<string>((observer) => {
      console.log('writeFile start');
      this.fs.writeFile(path, content, 'utf-8', (err) => {
        console.log('writeFile cb');
        if (err) throw err;
        observer.next(path);
        observer.complete();
      })
    })
    return res;
  }
  removeDir(path: string): Observable<string> {
    const res = new Observable<string>((observer) => {
      console.log('removeDir start');
      this.fs.rmdir(path, { 'recursive': true }, (err) => {
        console.log('removeDir finished');
        if (err) console.log(err);
        observer.next(path);
        observer.complete();
      })
    })
    return res;
  }
  renameDir(fromPath: string, toPath: string): Observable<string> {
    return this._rename(fromPath, toPath);
  }
  renameFile(fromPath: string, toPath: string): Observable<string> {
    return this._rename(fromPath, toPath);

  }
  _rename(fromPath: string, toPath: string): Observable<string> {
    const res = new Observable<string>((observer) => {
      if (fromPath == toPath) {
        observer.next(toPath);
        observer.complete();
      } else {
        this.fs.rename(fromPath, toPath, () => {
          observer.next(toPath);
          observer.complete();
        })
      }
    })
    return res;
  }
  duplicateFile(path: string, fromName: string, toName?: string): Observable<string> {
    let newName: string;
    if (toName) {
      newName = toName;
    } else {
      let firstDot = fromName.indexOf(".");
      if (firstDot == -1) {
        newName = fromName + "_dup";
      } else {
        let firstPart = fromName.slice(0, firstDot);
        let restPart = fromName.slice(firstDot);
        newName = firstPart + "_dup" + restPart;
      }
      console.log(firstDot);
      // console.log(firstPart);
      // console.log(restPart);
    }
    const res = new Observable<string>((observer) => {
      this.fs.copyFile(path + fromName, path + newName, () => {
        console.log('copyFile cb');
        observer.next(path + newName);
        observer.complete();
      })
    });
    return res;
  }
  readFile(path: string): Observable<string> {
    const res = new Observable<string>((observer) => {
      this.fs.readFile(path, (err, data) => {
        observer.next(data.toString());
        observer.complete();
      })
    });
    return res;
  }
  writeFile(path: string, content: string): Observable<string> {
    const res = new Observable<string>((observer) => {
      this.fs.writeFile(path, content, (err) => {
        observer.next(path);
        observer.complete();
      })
    });
    return res;
  }
  listDir(path: string): Observable<Array<FileDescription>> {
    const res = new Observable<Array<FileDescription>>((observer) => {
      this.fs.readdir(path, { 'withFileTypes': true }, (err, files) => {
        let r = files.map((dirent: fs.Dirent) => {
          let stat = this.fs.statSync(path + dirent.name);
          let fDesc = {
            'name': dirent.name,
            'ctime': stat.ctime,
            'isFile': dirent.isFile(),
            'size': stat.size,
            'mtime': stat.mtime,
            'mode': stat.mode,
          }
          return fDesc;
        });
        observer.next(r);
      });
    })
    return res;
  }
  startPowershell(path: string, args: Array<string>): void {
    console.log("start powershell");
    const np = this.childProcess.spawn("powershell.exe", ['-noexit', `-Command Set-Location ${path}`, ...args], {
      'detached': true,
      'shell': true,
    });
    np.on('close', (code) => {
      console.log(`close with code ${code}`);
    });
    np.on('error', (err) => {
      console.log(err);
    });
    console.log(np.pid);


  }
  initContextMenu() {
    const menu = new this.remote.Menu();
    if (this.contextMenu) return;
    menu.append(new this.remote.MenuItem({ label: 'MenuItem1', click: () => { console.log("item1 clicked") } }));
    menu.append(new this.remote.MenuItem({ type: 'separator' }));
    menu.append(new this.remote.MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }));
    this.contextMenu = menu;
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      menu.popup({ window: this.remote.getCurrentWindow() });
      console.log(menu);
    }, false);
  }
  openFileWithDefault(path: string): void {
    this.shell.openPath(path);
  }

}