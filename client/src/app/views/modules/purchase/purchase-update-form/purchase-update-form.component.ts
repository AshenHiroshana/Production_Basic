import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';

import {PurchasematerialUpdateSubFormComponent} from './purchasematerial-update-sub-form/purchasematerial-update-sub-form.component';
import {Purchase} from "../../../../entities/purchase";
import {Purchasematerial} from "../../../../entities/purchasematerial";
import {Supplier} from "../../../../entities/supplier";
import {Porder} from "../../../../entities/porder";
import {PorderService} from "../../../../services/porder.service";
import {PurchaseService} from "../../../../services/purchase.service";
import {SupplierService} from "../../../../services/supplier.service";
import {DateHelper} from "../../../../shared/date-helper";


@Component({
  selector: 'app-purchase-update-form',
  templateUrl: './purchase-update-form.component.html',
  styleUrls: ['./purchase-update-form.component.scss']
})
export class PurchaseUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  purchase: Purchase;
  purchasematerials: Purchasematerial[] = [];

  suppliers: Supplier[] = [];
  porders: Porder[] = [];
  @ViewChild(PurchasematerialUpdateSubFormComponent) purchasematerialUpdateSubForm: PurchasematerialUpdateSubFormComponent;

  form = new FormGroup({
    date: new FormControl(null, [
      Validators.required,
    ]),
    supplier: new FormControl(null, [
      Validators.required,
    ]),
    porder: new FormControl(null, [
    ]),
    purchasematerials: new FormControl(),
    discount: new FormControl(null, [
      Validators.min(2),
      Validators.max(99),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    total: new FormControl(null, [
      Validators.min(2),
      Validators.maxLength(8),
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
    private purchaseService: PurchaseService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
      this.setValues();
    });
  }

  async loadData(): Promise<any>{

    this.supplierField.disable();
    this.porderField.disable();
    this.totalprice();

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.supplierService.getAllBasic(new PageRequest()).then((supplierDataPage) => {
      this.suppliers = supplierDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.porderService.getAll(new PageRequest()).then((porderDataPage) => {
      this.porders = porderDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.purchase = await this.purchaseService.get(this.selectedId);

  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PURCHASE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PURCHASES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PURCHASE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PURCHASE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PURCHASE);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.dateField.pristine) {
      this.dateField.setValue(this.purchase.date);
    }
    if (this.supplierField.pristine) {
      this.supplierField.setValue(this.purchase.supplier.name);
    }
    if (this.porderField.pristine) {
      this.porderField.setValue(this.purchase.porder);
    }
    if (this.purchasematerialsField.pristine) {
      this.purchasematerialsField.setValue(this.purchase.purchasematerialList);
    }
    if (this.discountField.pristine) {
      this.discountField.setValue(this.purchase.discount);
    }
    if (this.totalField.pristine) {
      this.totalField.setValue(this.purchase.total);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.purchase.description);
    }
}

  async submit(): Promise<void> {
    this.purchasematerialUpdateSubForm.resetForm();
    this.purchasematerialsField.markAsDirty();
    if (this.form.invalid) { return; }

    const supplier1 = this.porderField.value;
    const newpurchase: Purchase = new Purchase();
    newpurchase.date = DateHelper.getDateAsString(this.dateField.value);
    newpurchase.supplier = supplier1.supplier.id;
    // newpurchase.supplier = this.supplierField.value;
    newpurchase.porder = this.porderField.value;
    newpurchase.purchasematerialList = this.purchasematerialsField.value;
    newpurchase.discount = this.discountField.value;
    newpurchase.total = this.totalField.value;
    newpurchase.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.purchaseService.update(this.selectedId, newpurchase);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/purchases/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/purchases');
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
}
