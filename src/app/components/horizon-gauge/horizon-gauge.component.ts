import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TelemetryService } from '../../services/telemetry.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-horizon-gauge',
  templateUrl: './horizon-gauge.component.html',
  styleUrls: ['./horizon-gauge.component.css']
})
export class HorizonGaugeComponent implements OnInit {
  @ViewChild('horizonGaugeCanvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  
  private ctx: CanvasRenderingContext2D;
  currentRoll: number = 0;
  currentPitch: number = 0;

  constructor(private telemetryService: TelemetryService) { }

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  ngAfterViewInit()
  {
    this.draw(this.currentRoll, this.currentPitch);
    this.telemetryService.authentication().subscribe(
      (successful) => 
      {
        if(successful)
        {
          this.telemetryService.getTestTelemetrySubject().subscribe((msg) => {
            // console.log(msg);
            this.draw(msg.payload.roll*100, msg.payload.pitch*100);
          });
        }
      }
    );    
  }

  draw( roll:number, pitch:number )
  {
    // console.log(roll,pitch);
    this.currentRoll = roll;
    this.currentPitch = pitch;

    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    let radius = this.canvas.nativeElement.height / 2;
    this.ctx.translate(radius, radius);
    this.ctx.moveTo(0, 0);

    this.drawHorizon(radius, roll, pitch);
    this.drawPitchMarkers(radius, roll, pitch);
    this.drawPointers(radius);

    this.ctx.translate(-radius, -radius);
  }

  drawHorizon(radius:number, roll:number, pitch:number)
  {
    let startPoint: number = (2*Math.PI) - roll;
    let endPoint: number = Math.PI - roll;

    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius, startPoint, endPoint);
    this.ctx.closePath();
    this.ctx.fillStyle = '#a17447';
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius, endPoint, startPoint);
    this.ctx.closePath();
    this.ctx.fillStyle = '#42a8d4';
    this.ctx.fill();

    const length = 15;
    const weight = 4;
    let lineColour = '#ffffff';

    this.ctx.rotate(-roll);
    for(let i=Math.PI; i<=2*Math.PI+0.1; i+=Math.PI/8)
    {
      this.drawHeadingMarker( length, weight, lineColour, radius, i, 0, 0);
    }
    this.ctx.rotate(roll);
  }

  drawHeadingMarker( length:number, LineWidth: number, color:string, radius:number, angle:number, xOrigin:number, yOrigin:number )
  {
    let circumferencePoint = this.getCircumferenceXY( radius, angle, xOrigin, yOrigin );
    let direction = { x: xOrigin - circumferencePoint.x, y: yOrigin -circumferencePoint.y };
    let mag = Math.sqrt( direction.x*direction.x + direction.y*direction.y );
    let unitVector = { x:direction.x/mag, y:direction.y/mag };

    let lineEndPoint = { x: (unitVector.x*length)+circumferencePoint.x , y: (unitVector.y*length)+circumferencePoint.y }

    // Vertical line
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = LineWidth;
    this.ctx.lineCap = "round";
    this.ctx.moveTo(circumferencePoint.x, circumferencePoint.y);
    this.ctx.lineTo(lineEndPoint.x, lineEndPoint.y);
    this.ctx.stroke();

  }

  getCircumferenceXY( radius:number, angle:number, xOrigin:number, yOrigin:number )
  {
    return {
              x: radius*Math.cos(angle)+xOrigin,
              y: radius*Math.sin(angle)+yOrigin
            };
  }

  drawPitchMarkers(radius:number, roll:number, pitch:number)
  {
    const spacing:number = 18;
    const longWidth:number = 50;
    const shortWidth:number = 30;
    const centerMarker:number = 15;
    const lineWidth:number = 2;
    const NumDivisions:number = 4;
    const color:string = "#ffffff";

    let radsPerDivision = Math.PI/NumDivisions;
    let adjustedPitch = pitch/radsPerDivision*18;

    // Center Marker
    this.drawMarker( lineWidth, "#00ff00", centerMarker, 0, roll, adjustedPitch );

    // Upper Markers
    let currentYOffset = spacing;
  
    this.drawMarker( lineWidth, color, shortWidth, currentYOffset, roll, adjustedPitch );
    currentYOffset += spacing;
    this.drawMarker( lineWidth, color, longWidth, currentYOffset, roll, adjustedPitch );
    currentYOffset += spacing;
    this.drawMarker( lineWidth, color, shortWidth, currentYOffset, roll, adjustedPitch );
    currentYOffset += spacing;
    this.drawMarker( lineWidth, color, longWidth, currentYOffset, roll, adjustedPitch );

    // Lower Markers
    currentYOffset = -spacing;
  
    this.drawMarker( lineWidth, color, shortWidth, currentYOffset, roll, adjustedPitch );
    currentYOffset -= spacing;
    this.drawMarker( lineWidth, color, longWidth, currentYOffset, roll, adjustedPitch );
    currentYOffset -= spacing;
    this.drawMarker( lineWidth, color, shortWidth, currentYOffset, roll, adjustedPitch );
    currentYOffset -= spacing;
    this.drawMarker( lineWidth, color, longWidth, currentYOffset, roll, adjustedPitch );
  }

  drawMarker( lineWidth:number, color:string, length:number, yOffset:number, roll: number, pitch:number )
  {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = "round";
    this.ctx.rotate(-roll);
    this.ctx.moveTo(-length/2, -yOffset+pitch);
    this.ctx.lineTo(length/2, -yOffset+pitch);
    this.ctx.stroke();
    this.ctx.rotate(roll);
  }

  
  drawPointers(radius:number)
  {

    // Roll Marker
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#ff0000";
    this.ctx.lineWidth = 7;
    this.ctx.lineCap = "square";
    this.ctx.moveTo(0, -radius+20);
    this.ctx.lineTo(0, -115);
    this.ctx.stroke();

    // Vertical line
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#000000";
    this.ctx.lineWidth = 7;
    this.ctx.lineCap = "square";
    this.ctx.moveTo(0, radius);
    this.ctx.lineTo(0, 10);
    this.ctx.stroke();

    // Pitch indicator
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#ff0000";
    this.ctx.lineWidth = 7;
    this.ctx.lineCap = "square";
    this.ctx.moveTo(0, 10);
    this.ctx.lineTo(0, 5);
    this.ctx.stroke();

    // Horizontal line
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#000000";
    this.ctx.lineWidth = 7;
    this.ctx.lineCap = "square";
    this.ctx.moveTo(-35, 30);
    this.ctx.lineTo(35, 30);
    this.ctx.stroke();

    //Left Wing holder
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#000000";
    this.ctx.lineWidth = 7;
    this.ctx.lineCap = "square";
    this.ctx.moveTo(-35, 30);
    this.ctx.lineTo(-35, 5);
    this.ctx.stroke();

    //Right Wing holder
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#000000";
    this.ctx.lineWidth = 7;
    this.ctx.lineCap = "square";
    this.ctx.moveTo(35, 30);
    this.ctx.lineTo(35, 5);
    this.ctx.stroke();

    //Left Wing
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#000000";
    this.ctx.lineWidth = 7;
    this.ctx.lineCap = "square";
    this.ctx.moveTo(-35, 5);
    this.ctx.lineTo(-75, 5);
    this.ctx.stroke();

    //Right Wing
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#000000";
    this.ctx.lineWidth = 7;
    this.ctx.lineCap = "square";
    this.ctx.moveTo(35, 5);
    this.ctx.lineTo(75, 5);
    this.ctx.stroke();

    //Left Wing Tip
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#ff0000";
    this.ctx.lineWidth = 7;
    this.ctx.lineCap = "square";
    this.ctx.moveTo(-75, 5);
    this.ctx.lineTo(-80, 5);
    this.ctx.stroke();

    //Right Wing Tip
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#ff0000";
    this.ctx.lineWidth = 7;
    this.ctx.lineCap = "square";
    this.ctx.moveTo(75, 5);
    this.ctx.lineTo(80, 5);
    this.ctx.stroke();

  }
  
}
