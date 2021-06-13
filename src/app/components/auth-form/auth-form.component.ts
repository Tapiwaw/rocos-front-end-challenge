import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TelemetryService } from '../../services/telemetry.service';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css']
})
export class AuthFormComponent implements OnInit {
  @ViewChild('appIdInput', { static: true })
  appIdInput: ElementRef<HTMLInputElement>;
  @ViewChild('secretKeyInput', { static: true })
  secretKeyInput: ElementRef<HTMLInputElement>;
  @ViewChild('formActionButton', { static: true })
  actionButton: ElementRef<HTMLButtonElement>;
  
  hasStarted: boolean = false;

  constructor(private telemetryService: TelemetryService) {}

  ngOnInit(): void {
    this.telemetryService.authentication().subscribe(
      (ready) => 
      {
        if(ready)
        {
          this.hasStarted = true;
          this.actionButton.nativeElement.innerHTML = "Stop";
        }
        else
        {
          this.hasStarted = false;
          this.actionButton.nativeElement.innerHTML = "Start";
        }
      }
    );
  }

  onActionButtonClick(): void {
    if(this.appIdInput.nativeElement.value === '' || this.secretKeyInput.nativeElement.value === '')
    {
      console.warn("AppId or security key is Invalid");
      return;
    }
  
    if(this.hasStarted)
    {
      this.telemetryService.stop();
    }
    else
    {
      this.telemetryService.authenticate(this.appIdInput.nativeElement.value, 
                                          this.secretKeyInput.nativeElement.value);
    }
  }
  
}
