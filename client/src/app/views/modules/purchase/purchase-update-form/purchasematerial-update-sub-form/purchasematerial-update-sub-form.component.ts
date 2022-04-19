import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Material} from "../../../../../entities/material";
import {Purchasematerial} from "../../../../../entities/purchasematerial";
import {MaterialService} from "../../../../../services/material.service";


@Component({
  selector: 'app-purchasematerial-update-sub-form',
  templateUrl: './purchasematerial-update-sub-form.component.html',
  styleUrls: ['./purchasematerial-update-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PurchasematerialUpdateSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PurchasematerialUpdateSubFormComponent),
      multi: true,
    }
  ]
})
export class PurchasematerialUpdateSubFormComponent extends AbstractSubFormComponent<Purchasematerial> implements OnInit{

  materials: Material[] = [];

  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    material: new FormControl(),
    qty: new FormControl(),
    unitprice: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get materialField(): FormControl{
    return this.form.controls.material as FormControl;
  }

  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }

  get unitpriceField(): FormControl{
    return this.form.controls.unitprice as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.materialField)
      &&   this.isEmptyField(this.qtyField)
      &&   this.isEmptyField(this.unitpriceField);
  }

  constructor(
    private materialService: MaterialService,
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.materialService.getAllBasic(new PageRequest()).then((materialDataPage) => {
      this.materials = materialDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  setValidations(): void{
    this.hasValidations = true;
    this.materialField.setValidators([Validators.required]);
    this.qtyField.setValidators([
      Validators.required,
      Validators.pattern('^([0-9]{1,10}([.][0-9]{1,3})?)$'),
      Validators.max(13),
      Validators.min(2),
    ]);
    this.unitpriceField.setValidators([
      Validators.required,
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
      Validators.max(10),
      Validators.min(2),
    ]);
  }

  removeValidations(): void{
    this.hasValidations = false;
    this.materialField.clearValidators();
    this.qtyField.clearValidators();
    this.unitpriceField.clearValidators();
  }

  fillForm(dataItem: Purchasematerial): void {
    this.idField.patchValue(dataItem.id);
    this.materialField.patchValue(dataItem.material.id);
    this.qtyField.patchValue(dataItem.qty);
    this.unitpriceField.patchValue(dataItem.unitprice);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(purchasematerial: Purchasematerial): string {
    return 'Are you sure to remove \u201C ' + purchasematerial.material.name + ' \u201D from allowance list ?';
  }

  getUpdateConfirmMessage(purchasematerial: Purchasematerial): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + purchasematerial.material.name + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + purchasematerial.material.name + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Purchasematerial = new Purchasematerial();
    dataItem.id = this.idField.value;

    for (const material of this.materials){
      if (this.materialField.value === material.id) {
        dataItem.material = material;
        break;
      }
    }

    dataItem.qty = this.qtyField.value;
    dataItem.unitprice = this.unitpriceField.value;
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }
}
