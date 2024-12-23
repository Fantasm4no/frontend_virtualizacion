export class Book {
  id!: number; // El operador `!` indica que esta propiedad será inicializada posteriormente
  title!: string;
  author!: string;
  image_url?: string; // Propiedad opcional para la URL de la imagen

  constructor(id: number, title: string, author: string, image_url?: string) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.image_url = image_url; // Inicializamos la URL de la imagen si está disponible
  }
}
