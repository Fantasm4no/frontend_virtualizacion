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
  showModal = false; // Estado del modal para agregar
  showModifyModal = false; // Estado del modal para modificar
  newBook: Partial<Book> = {}; // Libro nuevo
  currentBook: Partial<Book> = {}; // Libro actual para modificar

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

  // Abrir el modal para agregar un libro
  openModal(): void {
    this.showModal = true;
  }

  // Cerrar el modal de agregar
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

  // Abrir el modal para modificar un libro
  openModifyModal(book: Book): void {
    this.currentBook = { ...book }; // Copia los datos del libro actual
    this.showModifyModal = true;
  }

  // Cerrar el modal de modificar
  closeModifyModal(): void {
    this.showModifyModal = false;
    this.currentBook = {}; // Limpiar el formulario
  }

  // Actualizar un libro
  updateBook(): void {
    if (this.currentBook.id && this.currentBook.title && this.currentBook.author) {
      this.bookService.updateBook(this.currentBook.id, this.currentBook as Book).subscribe(
        (updatedBook: Book) => {
          // Actualiza el libro en la lista local
          const index = this.books.findIndex((b) => b.id === updatedBook.id);
          if (index !== -1) {
            this.books[index] = updatedBook;
          }
          this.closeModifyModal();
        },
        (error) => {
          console.error('Error updating book:', error);
        }
      );
    }
  }

  // Eliminar un libro por ID
  deleteBook(id: number): void {
    this.bookService.deleteBook(id).subscribe(
      () => {
        // Actualizar la lista local eliminando el libro
        this.books = this.books.filter((book) => book.id !== id);
      },
      (error) => {
        console.error('Error deleting book:', error);
      }
    );
  }
}