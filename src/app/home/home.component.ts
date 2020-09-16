import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ElectronService } from 'app/core/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private electronService: ElectronService,
  ) {

  }

  ngOnInit(): void {

  }
  public choosePath: string;
  setHomeDir(): void {
    this.choosePath = this.electronService.remote.dialog.showOpenDialogSync(
      this.electronService.remote.getCurrentWindow(),
      {
        "properties": ["openDirectory",],
      }
    )[0];
  }
  go(path: string): void {
    if (!path) {
      alert("not path chosen!");
      return;
    }
    let navigationExtras: NavigationExtras = {
      queryParams: { 'basePath': this.choosePath },
    };
    this.router.navigate(['/detail',], navigationExtras);
  }

}
