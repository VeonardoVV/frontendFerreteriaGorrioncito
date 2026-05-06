export type CatalogProduct = {
  id: number;
  titulo: string;
  categoria: string;
  marca: string;
  precio: string;
  imagen: string;
};

export type CatalogCategory = {
  id: number;
  nombre: string;
  total: number;
};
