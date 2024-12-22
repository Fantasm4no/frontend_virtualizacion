import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private baseUrl = 'http://34.67.85.184:3000/api/files'; // URL base de la API de archivos

  constructor(private http: HttpClient) {}

  // Obtener la lista de archivos
  getFiles(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl);
  }

  // Subir un archivo
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  // Descargar un archivo por nombre
  downloadFile(filename: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${filename}`, { responseType: 'blob' });
  }
}
