import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TelemetryService } from '../../services/telemetry.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-heading-gauge',
  templateUrl: './heading-gauge.component.html',
  styleUrls: ['./heading-gauge.component.css']
})
export class HeadingGaugeComponent implements OnInit {

  @ViewChild('headingGaugeCanvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  
  private ctx: CanvasRenderingContext2D;
  currentYaw: number = 0;

  constructor(private telemetryService: TelemetryService) { }

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  ngAfterViewInit()
  {
    this.draw(this.currentYaw);
    this.telemetryService.authentication().subscribe(
      (successful) => 
      {
        if(successful)
        {
          this.telemetryService.getTestTelemetrySubject().subscribe((msg) => {
            // console.log(msg);
            this.draw(msg.payload.yaw*100);
          });
        }
      }
    ); 
  }

  draw( yaw:number )
  {
    this.currentYaw = yaw;

    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    let radius = this.canvas.nativeElement.height / 2;
    this.ctx.translate(radius, radius);
    this.ctx.moveTo(0, 0);

    this.ctx.rotate(-yaw);
    this.drawHeading(radius);
    this.ctx.rotate(yaw);

    this.drawLineArrow(0, 40, 0, -40);
    this.ctx.translate(-radius, -radius);
  }

  drawHeading(radius:number)
  {
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius, 0, 2*Math.PI);
    this.ctx.closePath();
    this.ctx.fillStyle = '#c0c0c0';
    this.ctx.fill();

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
        this.drawHeadingLabel('90', offset, heavyLength, lineColour, radius, i, 0, 0);
        this.drawHeadingMarker( heavyLength, heavyWeight, lineColour, radius, i, 0, 0);
      }
      else if(count === 5 )
      {
        let offset = { x: -18, y:-4 };
        this.drawHeadingLabel('180', offset, heavyLength, lineColour, radius, i, 0, 0);
        this.drawHeadingMarker( heavyLength, heavyWeight, lineColour, radius, i, 0, 0);
      }
      else if(count === 9 )
      {
        let offset = { x: 3, y:8 };
        this.drawHeadingLabel('270', offset, heavyLength, lineColour, radius, i, 0, 0);
        this.drawHeadingMarker( heavyLength, heavyWeight, lineColour, radius, i, 0, 0);
      }
      else if(count === 13 )
      {
        let offset = { x: -6, y:22 };
        this.drawHeadingLabel('0', offset, heavyLength, lineColour, radius, i, 0, 0);
        this.drawHeadingMarker( heavyLength, heavyWeight, lineColour, radius, i, 0, 0);
      }
      else
      {
        this.drawHeadingMarker( length, weight, lineColour, radius, i, 0, 0);
      }
    }
    
  }

  drawHeadingLabel(text:string, offest, length:number, color:string, radius:number, angle:number, xOrigin:number, yOrigin:number )
  {
    let line = this.calcPerpCircumferenceLine(length, radius, angle, xOrigin, yOrigin);
    
    this.ctx.font = '25px serif';
    this.ctx.fillStyle = '#000000';
    this.ctx.fillText(text, line.toX+offest.x, line.toY+offest.y);
  }

  drawHeadingMarker( length:number, LineWidth: number, color:string, radius:number, angle:number, xOrigin:number, yOrigin:number )
  {

    let line = this.calcPerpCircumferenceLine(length, radius, angle, xOrigin, yOrigin);

    // Vertical line
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = LineWidth;
    this.ctx.lineCap = "round";
    this.ctx.moveTo(line.fromX, line.fromY);
    this.ctx.lineTo(line.toX, line.toY);
    this.ctx.stroke();
  }

  calcPerpCircumferenceLine(length:number, radius:number, angle:number, xOrigin:number, yOrigin:number)
  {
    let circumferencePoint = this.getCircumferenceXY( radius, angle, xOrigin, yOrigin );
    let direction = { x: xOrigin - circumferencePoint.x, y: yOrigin -circumferencePoint.y };
    let mag = Math.sqrt( direction.x*direction.x + direction.y*direction.y );
    let unitVector = { x:direction.x/mag, y:direction.y/mag };

    return { fromX: circumferencePoint.x,
              fromY: circumferencePoint.y,
              toX: (unitVector.x*length)+circumferencePoint.x,
              toY: (unitVector.y*length)+circumferencePoint.y };
  }

  getCircumferenceXY( radius:number, angle:number, xOrigin:number, yOrigin:number )
  {
    return {
              x: radius*Math.cos(angle)+xOrigin,
              y: radius*Math.sin(angle)+yOrigin
            };
  }

  drawLineArrow ( fromX:number, fromY:number, toX:number, toY:number ) {
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
