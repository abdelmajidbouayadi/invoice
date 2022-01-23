import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { EditResponse } from 'src/app/common/validators/edit-response.model';
import { Product } from 'src/app/products/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})


export class EditProductComponent implements OnInit {
  @Input('product') product!: Product;
  editProductResponse= new EditResponse();
  @Output('SaveOrCancel') event = new EventEmitter();
  form = this.fb.group({
    _id: '',
    barcode: '',
    title: ['', Validators.required],
    description: '',
    sellingPrice: 0,
    costPrice: 0,
  });
  newProduct = false;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductService
  ) {}

  ngOnInit(): void {
    if(!this.product) this.newProduct = true;
    this.form.patchValue(this.product || {});
  }
  onSubmit() {
    this.editProductResponse.save = true;
    //handle 2 case new product and updateProduct
    let handleProduct = this.newProduct ?
                       this.productsService.saveProduct(this.form.value):
                       this.productsService.updateProduct(this.product?._id, this.form.value);


    handleProduct.subscribe({
        next: (resProduct: any) => {
          this.editProductResponse.complete = true;
          this.productsService.addProductToService(resProduct,this.newProduct);

          this.event.emit({product : resProduct});
        },
        error: (err) => {
          //not finished
          console.log(err)
          this.editProductResponse.error = true;
          this.editProductResponse.save = false;
        },
      });
  }
  onCancel() {
    this.event.emit({ cancel: true });
  }
}
