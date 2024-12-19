import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseUrl = 'http://34.67.85.184:3000/api/books'; // URL base de la API

  constructor(private http: HttpClient) {}

  // Obtener todos los libros
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.baseUrl);
  }

  // Obtener un libro por ID
  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/${id}`);
  }

  // Agregar un nuevo libro
  addBook(book: Omit<Book, 'id'>): Observable<Book> {
    return this.http.post<Book>(this.baseUrl, book, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  // Actualizar un libro por ID
  updateBook(id: number, book: Omit<Book, 'id'>): Observable<Book> {
    return this.http.put<Book>(`${this.baseUrl}/${id}`, book, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  // Eliminar un libro por ID
  deleteBook(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}