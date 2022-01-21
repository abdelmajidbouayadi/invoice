import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/invoices/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.css']
})
export class SearchProductComponent implements OnInit {
  @Output('product') clickedProduct = new EventEmitter<Product>();
  subscription!: Subscription;
  products: Product[] = [];
  searchProducts: Product[] = [];
  printProducts:Product[] = [];
  constructor(private productService : ProductService) { }
  page= 1;
  collectionSize = 0;
  maxSize=10;
  ngOnInit(): void {
    this.subscription = this.productService.change().subscribe( res => {
      this.products = res;
      this.initialization();

    });
    this.productService.getProducts();

  }

  onInput($event: HTMLInputElement){
    let value = $event.value;
    this.searchProducts = this.products.filter(product =>  product?.description?.includes(value));
    this.page = 1;
    this.collectionSize = this.searchProducts?.length || 0;
    this.onPagination(1);
  }

  onPagination(index: number){
    if(index >0)
    this.printProducts = this.searchProducts.slice((index - 1)*this.maxSize,index*this.maxSize);
  }
  initialization(){
    this.searchProducts = this.products.slice();
    this.collectionSize= this.searchProducts?.length;
    this.onPagination(1);
  }
  // this function add product to invoice edit
  onAdd(product: Product){
    this.clickedProduct.emit(product);
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
