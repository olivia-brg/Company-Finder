import { bootstrapApplication } from '@angular/platform-browser';
import * as L from 'leaflet';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// import './polyfills';

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './material-module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    DemoMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  
  providers: []
})
export class AppModule {}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

  L.Icon.Default.mergeOptions({
    shadowUrl: '',
  });