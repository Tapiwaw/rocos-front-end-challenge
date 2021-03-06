import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ClusterHeaderComponent } from './components/cluster-header/cluster-header.component';
import { HorizonGaugeComponent } from './components/horizon-gauge/horizon-gauge.component';
import { HeadingGaugeComponent } from './components/heading-gauge/heading-gauge.component';
import { AuthFormComponent } from './components/auth-form/auth-form.component';

@NgModule({
  declarations: [
    AppComponent,
    ClusterHeaderComponent,
    HorizonGaugeComponent,
    HeadingGaugeComponent,
    AuthFormComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
