import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Pordermaterial} from "../../../../../entities/pordermaterial";
import { Material } from 'src/app/entities/material';
import {MaterialService} from "../../../../../services/material.service";


@Component({
  selector: 'app-pordermaterial-update-sub-form',
  templateUrl: './pordermaterial-update-sub-form.component.html',
  styleUrls: ['./pordermaterial-update-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PordermaterialUpdateSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PordermaterialUpdateSubFormComponent),
      multi: true,
    }
  ]
})
export class PordermaterialUpdateSubFormComponent extends AbstractSubFormComponent<Pordermaterial> implements OnInit{

  materials: Material[] = [];

  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    material: new FormControl(),
    qty: new FormControl(),
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

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.materialField)
      &&   this.isEmptyField(this.qtyField);
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
  }

  removeValidations(): void{
    this.hasValidations = false;
    this.materialField.clearValidators();
    this.qtyField.clearValidators();
  }

  fillForm(dataItem: Pordermaterial): void {
    this.idField.patchValue(dataItem.id);
    this.materialField.patchValue(dataItem.material.id);
    this.qtyField.patchValue(dataItem.qty);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(pordermaterial: Pordermaterial): string {
    return 'Are you sure to remove \u201C ' + pordermaterial.material.name + ' \u201D from allowance list ?';
  }

  getUpdateConfirmMessage(pordermaterial: Pordermaterial): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + pordermaterial.material.name + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + pordermaterial.material.name + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Pordermaterial = new Pordermaterial();
    dataItem.id = this.idField.value;

    for (const material of this.materials){
      if (this.materialField.value === material.id) {
        dataItem.material = material;
        break;
      }
    }

    dataItem.qty = this.qtyField.value;
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }
}
