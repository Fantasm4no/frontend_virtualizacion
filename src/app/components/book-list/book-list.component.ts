import { Component, OnInit } from '@angular/core';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-book-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  selectedFile: File | null = null; // Archivo seleccionado para subir
  showModal = false; // Estado del modal para agregar
  showModifyModal = false; // Estado del modal para modificar
  newBook: Partial<Book> = {}; // Datos del libro nuevo
  currentBook: Partial<Book> = {}; // Datos del libro actual para modificar

  constructor(private bookService: BookService, private fileService: FileService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  timestamp = new Date().getTime();

  loadBooks(): void {
    this.bookService.getBooks().subscribe(
      (data: Book[]) => {
        this.books = data;
        this.timestamp = new Date().getTime(); // Actualiza el timestamp
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
    this.selectedFile = null; // Limpiar archivo seleccionado
  }

  // Agregar un nuevo libro con imagen
  addBook(): void {
    if (this.newBook.title && this.newBook.author && this.selectedFile) {
      this.bookService.addBook(this.newBook as Book).subscribe(
        (book: Book) => {
          // Subir la imagen asociada
          this.fileService.uploadFile(this.selectedFile!, book.id).subscribe(
            () => {
              alert('Libro e imagen agregados con éxito.');
              this.loadBooks(); // Recarga la lista de libros
              this.closeModal();
            },
            (error) => {
              console.error('Error uploading file:', error);
              alert('Error al subir la imagen. Inténtalo nuevamente.');
            }
          );
        },
        (error) => {
          console.error('Error adding book:', error);
          alert('Error al agregar el libro.');
        }
      );
    } else {
      alert('Por favor completa todos los campos y selecciona un archivo.');
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
        () => {
          alert('Libro actualizado con éxito.');
          this.loadBooks(); // Recarga la lista de libros
          this.closeModifyModal();
        },
        (error) => {
          console.error('Error updating book:', error);
          alert('Error al actualizar el libro.');
        }
      );
    }
  }
  

  // Eliminar un libro por ID
  deleteBook(id: number): void {
    this.bookService.deleteBook(id).subscribe(
      () => {
        alert('Libro eliminado con éxito.');
        this.loadBooks(); // Recarga la lista de libros
      },
      (error) => {
        console.error('Error deleting book:', error);
        alert('Error al eliminar el libro.');
      }
    );
  }
  

  // Manejar la selección de un archivo
  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const allowedExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedExtensions.includes(file.type)) {
        alert('Please select a valid image file (.jpg, .jpeg, .png).');
        this.selectedFile = null;
        return;
      }
      this.selectedFile = file; // Asignar archivo si es válido
    }
  }  
}