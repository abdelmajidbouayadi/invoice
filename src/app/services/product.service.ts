import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from '../products/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [];
  private productsChange = new Subject<Product[]>();
  constructor(private http: HttpClient) {}
  private url = 'http://localhost:3000/api/products';
  saveProduct(product: Product) {
    return this.http.post(this.url, product);
  }
  addProductToService(product: Product, newProduct: boolean) {
    if (newProduct) {
      this.products.push(product);
      this.productsChange.next(this.products);
    } else {
      const index = this.products.findIndex(
        (prod) => prod?._id === product?._id
      );
      this.products[index] = product;
    }
  }
  getProducts() {
    this.http.get(this.url).subscribe((response: any) => {
      this.products = response;
      this.productsChange.next(response);
    });
  }

  change() {
    return this.productsChange.asObservable();
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((product) => product._id === id);
  }

  updateProduct(id: string, product: Product) {
    return this.http.patch(this.url + '/' + id, product);
  }

  deleteProduct(id: string) {
    return this.http.delete(this.url + '/' + id);
  }
}
