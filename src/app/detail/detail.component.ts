import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  public basePath: string;
  ngOnInit(): void {
    this.route.queryParams.subscribe(val => {
      console.log(val);
      this.basePath = val.basePath;
    })
  }
  constructor(public route: ActivatedRoute) {
  }

}
