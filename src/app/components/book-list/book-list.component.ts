import { Component, OnInit } from '@angular/core';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  showModal = false; // Estado del modal
  newBook: Partial<Book> = {}; // Libro nuevo

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  // Cargar libros desde el API
  loadBooks(): void {
    this.bookService.getBooks().subscribe(
      (data: Book[]) => {
        this.books = data;
      },
      (error) => {
        console.error('Error fetching books:', error);
      }
    );
  }

  // Abrir el modal
  openModal(): void {
    this.showModal = true;
  }

  // Cerrar el modal
  closeModal(): void {
    this.showModal = false;
    this.newBook = {}; // Limpiar el formulario
  }

  // Agregar un nuevo libro
  addBook(): void {
    if (this.newBook.title && this.newBook.author) {
      this.bookService.addBook(this.newBook as Book).subscribe(
        (book: Book) => {
          this.books.push(book); // Agregar el nuevo libro a la lista
          this.closeModal();
        },
        (error) => {
          console.error('Error adding book:', error);
        }
      );
    }
  }
}