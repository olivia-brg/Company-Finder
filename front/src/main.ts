import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import * as L from 'leaflet';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

  L.Icon.Default.mergeOptions({
    shadowUrl: '',
  });