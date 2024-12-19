export class Book {
    id!: number; // El operador `!` indica que esta propiedad será inicializada posteriormente
    title!: string;
    author!: string;
  
    constructor(id: number, title: string, author: string) {
      this.id = id;
      this.title = title;
      this.author = author;
    }
  }
  