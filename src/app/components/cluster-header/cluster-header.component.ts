import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cluster-header',
  templateUrl: './cluster-header.component.html',
  styleUrls: ['./cluster-header.component.css']
})
export class ClusterHeaderComponent implements OnInit {
  heading: string = "Rocos Test Telemetry"
  constructor() { }

  ngOnInit(): void {
  }

}
