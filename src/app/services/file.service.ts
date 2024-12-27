import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private baseUrl = 'http://34.8.231.8:3000/api/files'; // URL base de la API de archivos

  constructor(private http: HttpClient) {}

  // Obtener la lista de archivos
  getFiles(): Observable<{ files: string[] }> {
    return this.http.get<{ files: string[] }>(`${this.baseUrl}`);
  }

  // Subir un archivo asociado a un libro por su ID
  uploadFile(file: File, bookId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    // La URL incluye el ID del libro
    return this.http.post(`${this.baseUrl}/upload/${bookId}`, formData);
  }

  // Descargar un archivo por nombre
  downloadFile(filename: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${filename}`, { responseType: 'blob' });
  }
}
