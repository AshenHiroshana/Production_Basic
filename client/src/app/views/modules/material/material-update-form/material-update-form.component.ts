import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Material} from "../../../../entities/material";
import {Materialtype} from "../../../../entities/materialtype";
import {Brand} from "../../../../entities/brand";
import {Unit} from "../../../../entities/unit";
import {Materialstatus} from "../../../../entities/materialstatus";
import {MaterialtypeService} from "../../../../services/materialtype.service";
import {BrandService} from "../../../../services/brand.service";
import {UnitService} from "../../../../services/unit.service";
import {MaterialstatusService} from "../../../../services/materialstatus.service";
import {MaterialService} from "../../../../services/material.service";


@Component({
  selector: 'app-material-update-form',
  templateUrl: './material-update-form.component.html',
  styleUrls: ['./material-update-form.component.scss']
})
export class MaterialUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  material: Material;

  materialtypes: Materialtype[] = [];
  brands: Brand[] = [];
  units: Unit[] = [];
  materialstatuses: Materialstatus[] = [];

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
      Validators.min(0),
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
      Validators.min(2),
      Validators.max(1000),
      Validators.pattern('^([0-9]{1,10}([.][0-9]{1,3})?)$'),
    ]),
    materialstatus: new FormControl('1', [
      Validators.required,
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

  get materialstatusField(): FormControl{
    return this.form.controls.materialstatus as FormControl;
  }

  constructor(
    private materialtypeService: MaterialtypeService,
    private brandService: BrandService,
    private unitService: UnitService,
    private materialstatusService: MaterialstatusService,
    private materialService: MaterialService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.brandService.getAll().then((brands) => {
      this.brands = brands;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

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
    this.materialstatusService.getAll().then((materialstatuses) => {
      this.materialstatuses = materialstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.material = await this.materialService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MATERIAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MATERIALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MATERIAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MATERIAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MATERIAL);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.materialtypeField.pristine) {
      this.materialtypeField.setValue(this.material.materialtype.id);
    }
    if (this.nameField.pristine) {
      this.nameField.setValue(this.material.name);
    }
    if (this.brandField.pristine) {
      this.brandField.setValue(this.material.brand.id);
    }
    if (this.unitField.pristine) {
      this.unitField.setValue(this.material.unit.id);
    }
    if (this.qtyField.pristine) {
      this.qtyField.setValue(this.material.qty);
    }
    if (this.lastpurchasepriceField.pristine) {
      this.lastpurchasepriceField.setValue(this.material.lastpurchaseprice);
    }
    if (this.ropField.pristine) {
      this.ropField.setValue(this.material.rop);
    }
    if (this.materialstatusField.pristine) {
      this.materialstatusField.setValue(this.material.materialstatus.id);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newmaterial: Material = new Material();
    newmaterial.materialtype = this.materialtypeField.value;
    newmaterial.name = this.nameField.value;
    newmaterial.brand = this.brandField.value;
    newmaterial.unit = this.unitField.value;
    newmaterial.qty = this.qtyField.value;
    newmaterial.lastpurchaseprice = this.lastpurchasepriceField.value;
    newmaterial.rop = this.ropField.value;
    newmaterial.materialstatus = this.materialstatusField.value;
    try{
      const resourceLink: ResourceLink = await this.materialService.update(this.selectedId, newmaterial);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/materials/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/materials');
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
          if (msg.materialstatus) { this.materialstatusField.setErrors({server: msg.materialstatus}); knownError = true; }
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
      this.brandService.getAllByMaterialWithThis(this.material.id, this.nameField.value).then((brands) => {
        this.brands = brands;
      }).catch((e) => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }
  }
}
