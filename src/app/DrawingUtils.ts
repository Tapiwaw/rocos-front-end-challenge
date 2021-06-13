// Interfaces
export interface Point { x:number,
                         y:number 
                        }   
export interface Line { fromX:number, 
                        fromY:number, 
                        toX:number, 
                        toY:number 
                    }

// Util Functions                    
export function drawHeadingMarker(ctx:CanvasRenderingContext2D, length:number, LineWidth: number, color:string, radius:number, angle:number, xOrigin:number, yOrigin:number ): void {

    let line: Line = calcPerpCircumferenceLine(length, radius, angle, xOrigin, yOrigin);

    // Vertical line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = LineWidth;
    ctx.lineCap = "round";
    ctx.moveTo(line.fromX, line.fromY);
    ctx.lineTo(line.toX, line.toY);
    ctx.stroke();
}

export function drawHeadingLabel(ctx:CanvasRenderingContext2D, text:string, offest, length:number, color:string, radius:number, angle:number, xOrigin:number, yOrigin:number ): void {
    let line = calcPerpCircumferenceLine(length, radius, angle, xOrigin, yOrigin);
    
    ctx.font = '25px serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(text, line.toX+offest.x, line.toY+offest.y);
}

export function calcPerpCircumferenceLine(length:number, radius:number, angle:number, xOrigin:number, yOrigin:number): Line {
    let circumferencePoint = getCircumferenceXY( radius, angle, xOrigin, yOrigin );
    let direction = { x: xOrigin - circumferencePoint.x, y: yOrigin -circumferencePoint.y };
    let mag = Math.sqrt( direction.x*direction.x + direction.y*direction.y );
    let unitVector = { x:direction.x/mag, y:direction.y/mag };

    return { fromX: circumferencePoint.x,
              fromY: circumferencePoint.y,
              toX: (unitVector.x*length)+circumferencePoint.x,
              toY: (unitVector.y*length)+circumferencePoint.y };
}

export function getCircumferenceXY( radius:number, angle:number, xOrigin:number, yOrigin:number ): Point {
    return {
              x: radius*Math.cos(angle)+xOrigin,
              y: radius*Math.sin(angle)+yOrigin
            };
}