import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TelemetryService } from '../../services/telemetry.service';
import { IRocosTelemetryMessage } from 'rocos-js';
import { Observable, Subscription } from 'rxjs';
import { drawHeadingMarker, drawHeadingLabel } from '../../DrawingUtils';


@Component({
  selector: 'app-heading-gauge',
  templateUrl: './heading-gauge.component.html',
  styleUrls: ['./heading-gauge.component.css']
})
export class HeadingGaugeComponent implements OnInit {

  @ViewChild('headingGaugeCanvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  telemetryObservable: Observable<IRocosTelemetryMessage>;
  telemetrySubscription: Subscription;

  private ctx: CanvasRenderingContext2D;

  currentYaw: number = 0;

  constructor(private telemetryService: TelemetryService) { }

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  ngAfterViewInit(): void {
    this.draw(this.currentYaw);
    this.telemetryService.authentication().subscribe(
      (ready) => 
      {
        if(ready)
        {
          this.telemetryObservable = this.telemetryService.getTestTelemetryObservable();
          this.telemetrySubscription = this.telemetryObservable.subscribe((msg) => {
                                                                            // console.log(msg);
                                                                            this.draw(msg.payload.yaw);
                                                                          });
          console.log("Heading gauge telemetry subscribed");
        }
        else
        {
          if(this.telemetrySubscription !== undefined)
          {
            if(!this.telemetrySubscription.closed)
            {
              console.log("Heading gauge telemetry unsubscribed");
              this.telemetrySubscription.unsubscribe();
            }
          }
        }
      }
    ); 
  }

  draw( yaw:number ): void {
    this.currentYaw = yaw;

    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    let radius = this.canvas.nativeElement.height / 2;
    this.ctx.translate(radius, radius);
    this.ctx.moveTo(0, 0);

    this.ctx.rotate(-yaw);
    this.drawHeading(radius);
    this.ctx.rotate(yaw);
    
    // Draw Heading Arrow
    this.drawLineArrow(0, 40, 0, -40);
    this.ctx.translate(-radius, -radius);
  }

  drawHeading(radius:number): void {
    // Draw gauge
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius, 0, 2*Math.PI);
    this.ctx.closePath();
    this.ctx.fillStyle = '#c0c0c0';
    this.ctx.fill();

    // Draw Heading Markers
    const heavyLength = 20;
    const heavyWeight = 5;
    const length = 15;
    const weight = 3;
    let lineColour = '#000000';
    let count = 0;
    for(let i=0; i<=2*Math.PI; i+=Math.PI/8)
    {
      count++;
      if(count === 1 )
      {
        let offset = { x: -29, y:8 };
        drawHeadingLabel(this.ctx, '90', offset, heavyLength, lineColour, radius, i, 0, 0);
        drawHeadingMarker(this.ctx, heavyLength, heavyWeight, lineColour, radius, i, 0, 0);
      }
      else if(count === 5 )
      {
        let offset = { x: -18, y:-4 };
        drawHeadingLabel(this.ctx, '180', offset, heavyLength, lineColour, radius, i, 0, 0);
        drawHeadingMarker(this.ctx,  heavyLength, heavyWeight, lineColour, radius, i, 0, 0);
      }
      else if(count === 9 )
      {
        let offset = { x: 3, y:8 };
        drawHeadingLabel(this.ctx, '270', offset, heavyLength, lineColour, radius, i, 0, 0);
        drawHeadingMarker(this.ctx,  heavyLength, heavyWeight, lineColour, radius, i, 0, 0);
      }
      else if(count === 13 )
      {
        let offset = { x: -6, y:22 };
        drawHeadingLabel(this.ctx, '0', offset, heavyLength, lineColour, radius, i, 0, 0);
        drawHeadingMarker(this.ctx, heavyLength, heavyWeight, lineColour, radius, i, 0, 0);
      }
      else
      {
        drawHeadingMarker(this.ctx, length, weight, lineColour, radius, i, 0, 0);
      }
    }
    
  }

  drawLineArrow ( fromX:number, fromY:number, toX:number, toY:number ): void {
    var headlen = 20;
    var theta = 45;
    var arrowX, arrowY;

    var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI;
    var angle1 = (angle + theta) * Math.PI / 180;
    var angle2 = (angle - theta) * Math.PI / 180;
    var topX = headlen * Math.cos(angle1);
    var topY = headlen * Math.sin(angle1);
    var botX = headlen * Math.cos(angle2);
    var botY = headlen * Math.sin(angle2);
    this.ctx.beginPath();
    // draw a straight line
    this.ctx.moveTo(fromX, fromY);
    this.ctx.lineTo(toX, toY);

    arrowX = toX + topX;
    arrowY = toY + topY;
    //Draw the upper arrow line
    this.ctx.moveTo(arrowX, arrowY);
    this.ctx.lineTo(toX, toY);

    arrowX = toX + botX;
    arrowY = toY + botY;
    //Draw the arrow line below
    this.ctx.lineTo(arrowX, arrowY);
    
    this.ctx.lineWidth = 8;
    this.ctx.strokeStyle = "#000000";
    this.ctx.stroke();
}
}
