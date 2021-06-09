import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-heading-gauge',
  templateUrl: './heading-gauge.component.html',
  styleUrls: ['./heading-gauge.component.css']
})
export class HeadingGaugeComponent implements OnInit {

  @ViewChild('headingGaugeCanvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  
  private ctx: CanvasRenderingContext2D;

  constructor() { }

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  ngAfterViewInit()
  {
    this.draw(0);
  }

  draw( yaw:number)
  {
    let radius = this.canvas.nativeElement.height / 2;
    this.ctx.translate(radius, radius);

    this.drawHeading(radius, yaw);
  }

  drawHeading(radius:number, yaw:number)
  {
    let startPoint: number = (2*Math.PI) - yaw;
    let endPoint: number = Math.PI - yaw;

    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius, startPoint, endPoint);
    this.ctx.closePath();
    this.ctx.fillStyle = '#c0c0c0';
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius, endPoint, startPoint);
    this.ctx.closePath();
    this.ctx.fillStyle = '#c0c0c0';
    this.ctx.fill();
  }
}
