import { Component, OnInit } from '@angular/core';
import {Product, ProductDataPage} from '../../../../entities/product';
import {Productstatus} from '../../../../entities/productstatus';
import {Producttype} from '../../../../entities/producttype';
import {FormControl} from '@angular/forms';
import {ProducttypeService} from '../../../../services/producttype.service';
import {ProductstatusService} from '../../../../services/productstatus.service';
import {ProductService} from '../../../../services/product.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent extends AbstractComponent implements OnInit {

  productDataPage: ProductDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  producttypes: Producttype[] = [];
  productstatuses: Productstatus[] = [];

  codeField = new FormControl();
  nameField = new FormControl();
  producttypeField = new FormControl();
  productstatusField = new FormControl();

  constructor(
    private producttypeService: ProducttypeService,
    private productstatusService: ProductstatusService,
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {

    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();

    if (!this.privilege.showAll) { return; }

    this.setDisplayedColumns();

    const pageRequest = new PageRequest();
    pageRequest.pageIndex  = this.pageIndex;
    pageRequest.pageSize  = this.pageSize;

    pageRequest.addSearchCriteria('code', this.codeField.value);
    pageRequest.addSearchCriteria('name', this.nameField.value);
    pageRequest.addSearchCriteria('producttype', this.producttypeField.value);
    pageRequest.addSearchCriteria('productstatus', this.productstatusField.value);

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

    this.productService.getAll(pageRequest).then((page: ProductDataPage) => {
      this.productDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRODUCT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRODUCTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRODUCT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRODUCT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRODUCT);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['photo', 'code', 'name', 'price', 'producttype', 'status'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(product: Product): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: product.code + ' - ' + product.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.productService.delete(product.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }

}
