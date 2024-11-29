import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sede } from '../models/sede';

@Injectable({
  providedIn: 'root'
})
export class SedeService {

  private apiUrl = 'http://localhost:8080/api/sede';

  constructor(private http: HttpClient) { }

  // Obtener todas las sedes
  getSedes(): Observable<Sede[]> {
    return this.http.get<Sede[]>(this.apiUrl);
  }

  // Obtener una sede por ID
  getSedeById(id: number): Observable<Sede> {
    return this.http.get<Sede>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva sede
  createSede(sede: Sede): Observable<Sede> {
    return this.http.post<Sede>(this.apiUrl, sede);
  }

  // Actualizar una sede existente
  updateSede(sede: Sede, id: number): Observable<Sede> {
    return this.http.put<Sede>(`${this.apiUrl}/${id}`, sede);
  }

  // Eliminar una sede
  deleteSede(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
