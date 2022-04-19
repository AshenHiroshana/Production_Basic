import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Materialtype} from "../../../../entities/materialtype";
import { Brand } from 'src/app/entities/brand';
import {Unit} from "../../../../entities/unit";
import {MaterialtypeService} from "../../../../services/materialtype.service";
import {BrandService} from "../../../../services/brand.service";
import {UnitService} from "../../../../services/unit.service";
import {MaterialService} from "../../../../services/material.service";
import {Material} from "../../../../entities/material";



@Component({
  selector: 'app-material-form',
  templateUrl: './material-form.component.html',
  styleUrls: ['./material-form.component.scss']
})
export class MaterialFormComponent extends AbstractComponent implements OnInit {

  materialtypes: Materialtype[] = [];
  brands: Brand[] = [];
  units: Unit[] = [];
  rop = 0;

  form = new FormGroup({
    materialtype: new FormControl(null, [
      Validators.required,
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    brand: new FormControl(null, [
      Validators.required,
    ]),
    unit: new FormControl(null, [
      Validators.required,
    ]),
    qty: new FormControl(null, [
      Validators.required,
      Validators.min(2),
      Validators.max(10000),
      Validators.pattern('^([0-9]{1,10}([.][0-9]{1,3})?)$'),
    ]),
    lastpurchaseprice: new FormControl(null, [
      Validators.required,
      Validators.min(2),
      Validators.max(10000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    rop: new FormControl(null, [
      Validators.required,
      Validators.min(0.2),
      Validators.max(1000),
      Validators.pattern('^([0-9]{1,10}([.][0-9]{1,3})?)$'),
    ]),
  });

  get materialtypeField(): FormControl{
    return this.form.controls.materialtype as FormControl;
  }

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get brandField(): FormControl{
    return this.form.controls.brand as FormControl;
  }

  get unitField(): FormControl{
    return this.form.controls.unit as FormControl;
  }

  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }

  get lastpurchasepriceField(): FormControl{
    return this.form.controls.lastpurchaseprice as FormControl;
  }

  get ropField(): FormControl{
    return this.form.controls.rop as FormControl;
  }

  private materialtypeService: MaterialtypeService;

  constructor(
    materialtypeService: MaterialtypeService,
    private brandService: BrandService,
    private unitService: UnitService,
    private materialService: MaterialService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
    this.materialtypeService = materialtypeService;
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{


    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.materialtypeService.getAll().then((materialtypes) => {
      this.materialtypes = materialtypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.unitService.getAll().then((units) => {
      this.units = units;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.assignReOrderLevel();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MATERIAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MATERIALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MATERIAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MATERIAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MATERIAL);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const material: Material = new Material();
    material.materialtype = this.materialtypeField.value;
    material.name = this.nameField.value;
    material.brand = this.brandField.value;
    material.unit = this.unitField.value;
    material.qty = this.qtyField.value;
    material.lastpurchaseprice = this.lastpurchasepriceField.value;
    material.rop = this.ropField.value;
    try{
      const resourceLink: ResourceLink = await this.materialService.add(material);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/materials/' + resourceLink.id);
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
          if (msg.materialtype) { this.materialtypeField.setErrors({server: msg.materialtype}); knownError = true; }
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.brand) { this.brandField.setErrors({server: msg.brand}); knownError = true; }
          if (msg.unit) { this.unitField.setErrors({server: msg.unit}); knownError = true; }
          if (msg.qty) { this.qtyField.setErrors({server: msg.qty}); knownError = true; }
          if (msg.lastpurchaseprice) { this.lastpurchasepriceField.setErrors({server: msg.lastpurchaseprice}); knownError = true; }
          if (msg.rop) { this.ropField.setErrors({server: msg.rop}); knownError = true; }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }

  loadBrand(): void{
    if (this.nameField.value != null && this.nameField.value !== ''){
      this.brandService.getAllByMaterial(this.nameField.value).then((brands) => {
        this.brands = brands;
      }).catch((e) => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }
  }

  assignReOrderLevel(): void{
   this.rop = this.qtyField.value;
   if (this.qtyField.value == null){
     console.log('this.rop');
     this.rop = 0;
    }
   this.rop = (this.rop * 10) / 100;
   this.ropField.patchValue(this.rop);


  }

}
