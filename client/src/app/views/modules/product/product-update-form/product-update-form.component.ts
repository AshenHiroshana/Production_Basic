import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Product} from '../../../../entities/product';
import {Producttype} from '../../../../entities/producttype';
import {Productstatus} from '../../../../entities/productstatus';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../../../../services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProducttypeService} from '../../../../services/producttype.service';
import {ProductstatusService} from '../../../../services/productstatus.service';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';

@Component({
  selector: 'app-product-update-form',
  templateUrl: './product-update-form.component.html',
  styleUrls: ['./product-update-form.component.scss']
})
export class ProductUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  product: Product;

  producttypes: Producttype[] = [];
  productstatuses: Productstatus[] = [];

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
    productstatus: new FormControl(null, [
      Validators.required,
    ])
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

  get productstatusField(): FormControl{
    return this.form.controls.productstatus as FormControl;
  }

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    private producttypeService: ProducttypeService,
    private productstatusService: ProductstatusService) { super(); }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.producttypeService.getAll().then((producttypes) => {
      this.producttypes = producttypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.productstatusService.getAll().then((productstatuses) => {
      this.productstatuses = productstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.product = await this.productService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRODUCT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRODUCTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRODUCT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRODUCT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRODUCT);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.photoField.pristine) {
      if (this.product.photo) { this.photoField.setValue([this.product.photo]); }
      else { this.photoField.setValue([]); }
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.product.description);
    }
    if (this.nameField.pristine) {
      this.nameField.setValue(this.product.name);
    }
    if (this.priceField.pristine) {
      this.priceField.setValue(this.product.price);
    }
    if (this.producttypeField.pristine) {
      this.producttypeField.setValue(this.product.producttype.id);
    }

    if (this.productstatusField.pristine) {
      this.productstatusField.setValue(this.product.productstatus.id);
    }

  }

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    if (this.form.invalid) { return; }

    const newproduct: Product = new Product();
    newproduct.name = this.nameField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      newproduct.photo = photoIds[0];
    }else{
      newproduct.photo = null;
    }
    newproduct.description = this.descriptionField.value;
    newproduct.name = this.nameField.value;
    newproduct.price = this.priceField.value;
    newproduct.producttype = this.producttypeField.value;
    newproduct.productstatus = this.productstatusField.value;

    try{
      const resourceLink: ResourceLink = await this.productService.update(this.selectedId, newproduct);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/products/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/products');
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
          if (msg.productstatus) { this.productstatusField.setErrors({server: msg.productstatus}); knownError = true; }
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
