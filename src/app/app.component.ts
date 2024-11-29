import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavegarComponent } from "./component/navegar/navegar.component";
import { FacultadComponent } from './facultad/facultad.component';
import { SedeComponent } from './sede/sede.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavegarComponent, FacultadComponent, SedeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'examenLPNM';
}
