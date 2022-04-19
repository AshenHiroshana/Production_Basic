import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Supplierpayment} from "../../../../entities/supplierpayment";
import {Purchase} from "../../../../entities/purchase";
import {Paymenttype} from "../../../../entities/paymenttype";
import {Paymentstatus} from "../../../../entities/paymentstatus";
import {PurchaseService} from "../../../../services/purchase.service";
import {PaymenttypeService} from "../../../../services/paymenttype.service";
import {PaymentstatusService} from "../../../../services/paymentstatus.service";
import {SupplierpaymentService} from "../../../../services/supplierpayment.service";
import {DateHelper} from "../../../../shared/date-helper";

@Component({
  selector: 'app-supplierpayment-form',
  templateUrl: './supplierpayment-form.component.html',
  styleUrls: ['./supplierpayment-form.component.scss']
})
export class SupplierpaymentFormComponent extends AbstractComponent implements OnInit {

  purchases: Purchase[] = [];
  purchases2: Purchase[] = [];
  paymenttypes: Paymenttype[] = [];
  paymentstatuses: Paymentstatus[] = [];
  supplierpayment: Supplierpayment;


  public selected: any;

  form = new FormGroup({
    purchase: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    amount: new FormControl(null, [
      Validators.required,
      Validators.min(2),
      Validators.max(10),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    paymenttype: new FormControl(null, [
      Validators.required,
    ]),
    chequeno: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(60),
    ]),
    chequedate: new FormControl(null, [
    ]),
    chequebank: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    chequebranch: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    paymentstatus: new FormControl(null, [
      Validators.required,
    ]),
  });

  get purchaseField(): FormControl{
    return this.form.controls.purchase as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get amountField(): FormControl{
    return this.form.controls.amount as FormControl;
  }

  get paymenttypeField(): FormControl{
    return this.form.controls.paymenttype as FormControl;
  }

  get chequenoField(): FormControl{
    return this.form.controls.chequeno as FormControl;
  }

  get chequedateField(): FormControl{
    return this.form.controls.chequedate as FormControl;
  }

  get chequebankField(): FormControl{
    return this.form.controls.chequebank as FormControl;
  }

  get chequebranchField(): FormControl{
    return this.form.controls.chequebranch as FormControl;
  }

  get paymentstatusField(): FormControl{
    return this.form.controls.paymentstatus as FormControl;
  }

  constructor(
    private purchaseService: PurchaseService,
    private paymenttypeService: PaymenttypeService,
    private paymentstatusService: PaymentstatusService,
    private supplierpaymentService: SupplierpaymentService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {

    this.purchaseService.getUnpaidAll(new PageRequest()).then((purchaseDataPage) => {
      this.purchases2 = purchaseDataPage.content;
      // if (this.purchases2 != null) {
      //   this.purchases2.forEach(purchase => {
      //     if (this.supplierpaymentService.getByPurchaseID(purchase.id) == null) {
      //       this.purchases.push(purchase);
      //     }
      //   });
      // }
      // console.log(this.purchases);
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });



    this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any>{

    this.amountField.disable();

    this.updatePrivileges();
    if (!this.privilege.add) { return; }
    this.paymenttypeService.getAll().then((paymenttypes) => {
      if (this.paymenttypeField.pristine){
        this.paymenttypes = paymenttypes;
      }
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIERPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SUPPLIERPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SUPPLIERPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIERPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIERPAYMENT);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const supplierpayment: Supplierpayment = new Supplierpayment();
    supplierpayment.purchase = this.purchaseField.value.id;
    supplierpayment.date = DateHelper.getDateAsString(this.dateField.value);
    supplierpayment.amount = this.amountField.value;
    supplierpayment.paymenttype = this.paymenttypeField.value.id;
    supplierpayment.chequeno = this.chequenoField.value;
    supplierpayment.chequedate = this.chequedateField.value ? DateHelper.getDateAsString(this.chequedateField.value) : null;
    supplierpayment.chequebank = this.chequebankField.value;
    supplierpayment.chequebranch = this.chequebranchField.value;
    supplierpayment.paymentstatus = this.paymentstatusField.value;
    try{
      const resourceLink: ResourceLink = await this.supplierpaymentService.add(supplierpayment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/supplierpayments/' + resourceLink.id);
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
          if (msg.purchase) { this.purchaseField.setErrors({server: msg.purchase}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.amount) { this.amountField.setErrors({server: msg.amount}); knownError = true; }
          if (msg.paymenttype) { this.paymenttypeField.setErrors({server: msg.paymenttype}); knownError = true; }
          if (msg.chequeno) { this.chequenoField.setErrors({server: msg.chequeno}); knownError = true; }
          if (msg.chequedate) { this.chequedateField.setErrors({server: msg.chequedate}); knownError = true; }
          if (msg.chequebank) { this.chequebankField.setErrors({server: msg.chequebank}); knownError = true; }
          if (msg.chequebranch) { this.chequebranchField.setErrors({server: msg.chequebranch}); knownError = true; }
          if (msg.paymentstatus) { this.paymentstatusField.setErrors({server: msg.paymentstatus}); knownError = true; }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }

  async loadAmount(): Promise<void>{

    // console.log('Hi');
    // console.log(this.porderField.value);

    const purchse = this.purchaseField.value;
    if (this.amountField.pristine) {
      this.amountField.patchValue(purchse.total);
    }



  //   this.pordermaterials = porder.pordermaterialList.map((material) => Object.assign(new Purchasematerial(), material));
  //
  //   console.log(this.materials);
  //
  //   if (this.purchasematerialsField.pristine) {
  //     this.purchasematerialsField.setValue(this.pordermaterials);
  //   }
  }

  dateValidator(): Date {
    return new Date();
  }

  loadStatus(): void {
    this.paymentstatuses = [];
    this.paymentstatusService.getAll().then((paymentstatuses) => {
      if (this.paymenttypeField.value.id === 1){
        paymentstatuses.pop();
        paymentstatuses.pop();
        paymentstatuses.pop();
        this.paymentstatuses = paymentstatuses;
      }
      if (this.paymenttypeField.value.id === 2){
        this.paymentstatuses.push(paymentstatuses.pop());
        this.paymentstatuses.push(paymentstatuses.pop());
        this.paymentstatuses.push(paymentstatuses.pop());
      }
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }
}
