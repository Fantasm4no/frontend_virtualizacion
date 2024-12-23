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
  files: string[] = [];
  selectedFile: File | null = null; // Archivo seleccionado para subir
  showModal = false; // Estado del modal para agregar
  showModifyModal = false; // Estado del modal para modificar
  newBook: Partial<Book> = {}; // Libro nuevo
  currentBook: Partial<Book> = {}; // Libro actual para modificar

  constructor(private bookService: BookService, private fileService: FileService) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadFiles();
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

  // Cargar archivos desde el API
  loadFiles(): void {
    this.fileService.getFiles().subscribe(
      (response: { files: string[] }) => {
        console.log('URLs de las imágenes:', response.files);
        this.files = response.files;
      },
      (error) => {
        console.error('Error al cargar las imágenes:', error);
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

  // Descargar un archivo
  downloadFile(filename: string): void {
    this.fileService.downloadFile(filename).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading file:', error);
      }
    );
  }

  // Manejar la selección de un archivo
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const allowedExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedExtensions.includes(file.type)) {
        alert('Por favor selecciona un archivo de imagen válido (.jpg, .jpeg, .png).');
        this.selectedFile = null; // Limpiar archivo seleccionado
        return;
      }
      this.selectedFile = file; // Asignar archivo si es válido
    }
  }
  

  // Subir un archivo
  onFileUpload(): void {
    if (this.selectedFile) {
      this.fileService.uploadFile(this.selectedFile).subscribe(
        () => {
          alert('Archivo subido con éxito');
          this.loadFiles(); // Recargar la lista de archivos
        },
        (error) => {
          console.error('Error uploading file:', error);
          alert('Error al subir el archivo. Por favor asegúrate de que sea una imagen válida (.jpg, .jpeg, .png).');
        }
      );
    } else {
      alert('Por favor selecciona un archivo primero.');
    }
  }  
}