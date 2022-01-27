import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from './product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  subscription!: Subscription;
  products: Product[] = [];
  //view products
  searchProducts: Product[] = [];
  printProducts: Product[] = [];

  //edit product
  productEditedIndex: number = NaN;
  productEdited!: Product;

  //new product
  newProduct= false;
  constructor(private productService: ProductService) {}
  page = 1;
  collectionSize = 0;
  maxSize = 12;
  deleteError = false;
  ngOnInit(): void {
    this.subscription = this.productService.change().subscribe((res) => {
      this.products = res;
      this.initialization();
    });
    this.productService.getProducts();
  }

  onInput($event: HTMLInputElement) {
    let value = $event.value;
    this.searchProducts = this.searchProduct(value);
    this.page = 1;
    this.collectionSize = this.searchProducts?.length || 0;
    this.onPagination(1);
  }
  searchProduct(value: string) {
    return this.products.filter((product) =>
      product?.description?.includes(value)
    );
  }

  onPagination(index: number) {
    if (index > 0)
      this.printProducts = this.searchProducts.slice(
        (index - 1) * this.maxSize,
        index * this.maxSize
      );
  }
  initialization() {
    this.searchProducts = this.products.slice();
    this.collectionSize = this.searchProducts?.length;
    this.page = 1;
    this.onPagination(1);
  }

  //function on click on button edit
  onEdit(index: number, product: Product) {
    this.productEditedIndex = index;
    this.productEdited = product;
  }
  onEditProductFinished($event: any) {
    //change the product edited in our component
    if ($event?.product)
      Object.assign(this.productEdited,$event.product);
    this.productEditedIndex = NaN;
  }
  onDelete(product: Product, index: number) {
    this.productService.deleteProduct(product._id).subscribe({
      next: () => {
        //initialize all product
        this.deleteProductInComponent(product, index);
      },
      error: (err) => {
        this.deleteError = true;
        setTimeout(() => (this.deleteError = false), 3000);
      },
    });
  }
  deleteProductInComponent(product: Product, index: number) {
    this.printProducts.splice(index, 1);
    this.searchProducts = this.searchProducts.filter(
      (prod) => prod !== product
    );
    this.products = this.products.filter((prod) => prod !== product);
  }

  onAddProduct(){
    //handle save or cancel button
    this.newProduct = false;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
