import {Component, Input, OnInit} from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {ViewChild} from '@angular/core';
import {PurchasematerialSubFormComponent} from './purchasematerial-sub-form/purchasematerial-sub-form.component';
import {ReplaySubject, Subject} from 'rxjs';
import {MatSelect} from '@angular/material/select';
import {take, takeUntil} from 'rxjs/operators';
import {isRequireCall} from '@angular/compiler-cli/ngcc/src/host/commonjs_umd_utils';
import {Purchase} from '../../../../entities/purchase';
import {Purchasematerial} from '../../../../entities/purchasematerial';
import {Supplier} from '../../../../entities/supplier';
import {Porder} from '../../../../entities/porder';
import {PorderService} from '../../../../services/porder.service';
import {PurchaseService} from '../../../../services/purchase.service';
import {SupplierService} from '../../../../services/supplier.service';
import {DateHelper} from '../../../../shared/date-helper';
import {Material} from '../../../../entities/material';
import {MaterialService} from '../../../../services/material.service';


@Component({
  selector: 'app-purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss']
})
export class PurchaseFormComponent extends AbstractComponent implements OnInit {

  // @Input
  // placeholderLabel = 'Search';

  materials: Material[] = [];
  pordermaterials: Purchasematerial[] = [];

  purchasematerials: Purchasematerial[] = [];

  suppliers: Supplier[] = [];
  // porder1: Porder;
  // supplier2: Supplier;
  porders: Porder[] = [];
  @ViewChild(PurchasematerialSubFormComponent) purchasematerialSubForm: PurchasematerialSubFormComponent;

  public source: Array<{ text: string, value: number }> = [
    { text: 'Small', value: 1 },
    { text: 'Medium', value: 2 },
    { text: 'Large', value: 3 }
  ];

  public data: Array<{ text: string, value: number }>;

  form = new FormGroup({
    date: new FormControl(null, [
      Validators.required,
    ]),
    supplier: new FormControl(null, [
      // Validators.required,
    ]),
    porder: new FormControl(),
    purchasematerials: new FormControl(), // filter porders
    discount: new FormControl(null, [
      Validators.min(0),
      Validators.max(99.99),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    total: new FormControl(null, [
      Validators.min(2),
      Validators.max(100000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
  });

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get supplierField(): FormControl{
    return this.form.controls.supplier as FormControl;
  }

  get porderField(): FormControl{
    return this.form.controls.porder as FormControl;
  }

  get purchasematerialsField(): FormControl{
    return this.form.controls.purchasematerials as FormControl;
  }

  get discountField(): FormControl{
    return this.form.controls.discount as FormControl;
  }

  get totalField(): FormControl{
    return this.form.controls.total as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private supplierService: SupplierService,
    private porderService: PorderService,
    private materialService: MaterialService,
    private purchaseService: PurchaseService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
    this.data = this.source.slice();
  }

  ngOnInit(): void {
    this.porderService.getAllByStatus(new PageRequest()).then((porderDataPage) => {
      this.porders = porderDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.loadData();
    this.refreshData();
  }






  async loadData(): Promise<any>{
    this.supplierField.disable();
    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.totalprice();

    this.supplierService.getAllBasic(new PageRequest()).then((supplierDataPage) => {
      this.suppliers = supplierDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PURCHASE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PURCHASES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PURCHASE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PURCHASE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PURCHASE);
  }

  async submit(): Promise<void> {
    this.totalprice();
    this.purchasematerialSubForm.resetForm();
    this.purchasematerialsField.markAsDirty();
    if (this.form.invalid) { return; }

    this.pordermaterials = this.purchasematerialsField.value;

    console.log(this.pordermaterials);

    if (this.purchasematerialsField.pristine) {
      this.purchasematerialsField.setValue(this.pordermaterials);
    }

    const purchase: Purchase = new Purchase();
    purchase.date = DateHelper.getDateAsString(this.dateField.value);
    purchase.supplier = this.porderField.value.supplier.id;
    purchase.porder = this.porderField.value;
    purchase.purchasematerialList = this.purchasematerialsField.value;
    purchase.discount = this.discountField.value;
    purchase.total = this.totalField.value;
    purchase.description = this.descriptionField.value;

    console.log(purchase);
    try{
      const resourceLink: ResourceLink = await this.purchaseService.add(purchase);
      if (this.privilege.showOne) {
        console.log(resourceLink.id);
        const x = resourceLink.id + 1 ;
        await this.router.navigateByUrl('/purchases/' + x);
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
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.supplier) { this.supplierField.setErrors({server: msg.supplier}); knownError = true; }
          if (msg.porder) { this.porderField.setErrors({server: msg.porder}); knownError = true; }
          if (msg.purchasematerialList) { this.purchasematerialsField.setErrors({server: msg.purchasematerialList}); knownError = true; }
          if (msg.discount) { this.discountField.setErrors({server: msg.discount}); knownError = true; }
          if (msg.total) { this.totalField.setErrors({server: msg.total}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }
  }
  totalprice(): void{
    let totals = 0;
    this.purchasematerials = this.purchasematerialsField.value;
    if (this.purchasematerials != null) {
      this.purchasematerials.forEach(purchasematerial => {
        if (purchasematerial.unitprice != null) {
          totals += purchasematerial.qty * purchasematerial.unitprice;
          this.porderField.disable();
          // console.log(totals);
        }else {
          // this.purchasematerialsField.setValidators(re);
          this.snackBar.open('Unit Price cannot be null', null, {duration: 35000});
        }
      });
    }
    if (this.discountField.value != null){
      totals -= (totals * this.discountField.value) / 100;
    }
    if (this.totalField.pristine) {
      this.totalField.setValue(totals);
    }
  }

  async loadSupplier(): Promise<void>{

     console.log('Hi');
     console.log(this.porderField.value);

     const porder = this.porderField.value;
     if (this.supplierField.pristine) {
      this.supplierField.patchValue(porder.supplier.name);
    }



     this.pordermaterials = porder.pordermaterialList.map((material) => Object.assign(new Purchasematerial(), material));

     for (const data of this.pordermaterials){
          data.unitprice = data.material.lastpurchaseprice;
     }

     console.log(this.pordermaterials);

     if (this.purchasematerialsField.pristine) {
      this.purchasematerialsField.setValue(this.pordermaterials);
    }
  }

  dateValidator(): Date {
    return new Date();
  }
}
