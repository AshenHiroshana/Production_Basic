import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {ViewChild} from '@angular/core';
import {DateHelper} from '../../../../shared/date-helper';
import {PordermaterialSubFormComponent} from './pordermaterial-sub-form/pordermaterial-sub-form.component';
import {Material} from "../../../../entities/material";
import {Supplier} from "../../../../entities/supplier";
import {SupplierService} from "../../../../services/supplier.service";
import {MaterialService} from "../../../../services/material.service";
import {PorderService} from "../../../../services/porder.service";
import {Porder} from "../../../../entities/porder";


@Component({
  selector: 'app-porder-form',
  templateUrl: './porder-form.component.html',
  styleUrls: ['./porder-form.component.scss']
})
export class PorderFormComponent extends AbstractComponent implements OnInit {

  materials: Material[] = [];
  suppliers: Supplier[] = [];
  @ViewChild(PordermaterialSubFormComponent) pordermaterialSubForm: PordermaterialSubFormComponent;

  form = new FormGroup({
    doordered: new FormControl(null, [
      Validators.required,
    ]),
    dorequired: new FormControl(null, [
      Validators.required,
    ]),
    supplier: new FormControl(null, [
      Validators.required,
    ]),
    pordermaterials: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
  });

  get doorderedField(): FormControl{
    return this.form.controls.doordered as FormControl;
  }

  get dorequiredField(): FormControl{
    return this.form.controls.dorequired as FormControl;
  }

  get supplierField(): FormControl{
    return this.form.controls.supplier as FormControl;
  }

  get pordermaterialsField(): FormControl{
    return this.form.controls.pordermaterials as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private supplierService: SupplierService,
    private materialService: MaterialService,
    private porderService: PorderService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.supplierService.getAllBasic(new PageRequest()).then((supplierDataPage) => {
      this.suppliers = supplierDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PORDER);
  }

  async submit(): Promise<void> {
    this.pordermaterialSubForm.resetForm();
    this.pordermaterialsField.markAsDirty();
    if (this.form.invalid) { return; }

    const porder: Porder = new Porder();
    porder.doordered = DateHelper.getDateAsString(this.doorderedField.value);
    porder.dorequired = DateHelper.getDateAsString(this.dorequiredField.value);
    porder.supplier = this.supplierField.value;
    porder.pordermaterialList = this.pordermaterialsField.value;
    porder.description = this.descriptionField.value;
    porder.doreceived = null;
    try{
      const resourceLink: ResourceLink = await this.porderService.add(porder);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/porders/' + resourceLink.id);
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
          if (msg.doordered) { this.doorderedField.setErrors({server: msg.doordered}); knownError = true; }
          if (msg.dorequired) { this.dorequiredField.setErrors({server: msg.dorequired}); knownError = true; }
          if (msg.supplier) { this.supplierField.setErrors({server: msg.supplier}); knownError = true; }
          if (msg.pordermaterialList) { this.pordermaterialsField.setErrors({server: msg.pordermaterialList}); knownError = true; }
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
  loadMaterials(): void{
    if (this.supplierField.value !== '' && this.supplierField.value != null){
      this.materialService.getAllBySupplier(this.supplierField.value).then((materialDataPage) => {
        this.materials = materialDataPage;
      }).catch((e) => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }
  }

  dateValidator(): Date {
    return new Date();
  }
}
