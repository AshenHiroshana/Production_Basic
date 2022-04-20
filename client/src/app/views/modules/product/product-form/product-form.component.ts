import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Producttype} from '../../../../entities/producttype';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../../../../services/product.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {ProducttypeService} from '../../../../services/producttype.service';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Product} from '../../../../entities/product';
import {ResourceLink} from '../../../../shared/resource-link';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent extends AbstractComponent implements OnInit {

  producttypes: Producttype[] = [];

  form = new FormGroup({
    description: new FormControl(null, [
      Validators.maxLength(65535),
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255),
    ]),
    photo: new FormControl(),
    price: new FormControl(null, [
      Validators.required,
      Validators.min(0.25),
      Validators.max(99999999),
      Validators.pattern('^([0-9]{1,8}([\\.][0-9]{2})?)$'),
    ]),
    producttype: new FormControl(null, [
      Validators.required,
    ]),
  });

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }

  get priceField(): FormControl{
    return this.form.controls.price as FormControl;
  }

  get producttypeField(): FormControl{
    return this.form.controls.producttype as FormControl;
  }

  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private router: Router,
    private producttypeService: ProducttypeService) { super(); }

  // 5. create ngOnInit method.

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

  // 6. create loadData method.
  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.producttypeService.getAll().then((producttypes) => {
      this.producttypes = producttypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

  }

  // 7. create userPrivilege method.
  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRODUCT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRODUCTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRODUCT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRODUCT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRODUCT);
  }

  // 8. CREATE SUBMIT METHOD.

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    if (this.form.invalid) { return; }

    const product: Product = new Product();
    product.name = this.nameField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      product.photo = photoIds[0];
    }else{
      product.photo = null;
    }
    product.description = this.descriptionField.value;
    product.producttype = this.producttypeField.value;

    try{
      const resourceLink: ResourceLink = await this.productService.add(product);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/products/' + resourceLink.id);
      } else {
        this.form.reset();
        this.snackBar.open('Successfully saved', null, {duration: 2000});
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.price) { this.priceField.setErrors({server: msg.price}); knownError = true; }
          if (msg.producttype) { this.producttypeField.setErrors({server: msg.producttype}); knownError = true; }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }

}
