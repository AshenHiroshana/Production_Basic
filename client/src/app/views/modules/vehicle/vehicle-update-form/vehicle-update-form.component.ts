import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {Vehicle} from '../../../../entities/vehicle';
import {Vehicletype} from '../../../../entities/vehicletype';
import {Vehiclestatus} from '../../../../entities/vehiclestatus';
import {VehicleService} from '../../../../services/vehicle.service';
import {VehicletypeService} from '../../../../services/vehicletype.service';
import {VehiclestatusService} from '../../../../services/vehiclestatus.service';
import {RouteService} from '../../../../services/route.service';

@Component({
  selector: 'app-vehicle-update-form',
  templateUrl: './vehicle-update-form.component.html',
  styleUrls: ['./vehicle-update-form.component.scss']
})
export class VehicleUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  vehicle: Vehicle;

  vehicletypes: Vehicletype[] = [];
  vehiclestatuses: Vehiclestatus[] = [];

  form = new FormGroup({
    description: new FormControl(null, [
      Validators.maxLength(25535)
    ]),
    no: new FormControl(null, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20),
    ]),
    brand: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(45),
    ]),
    model: new FormControl(null, [
      Validators.minLength(3),
      Validators.maxLength(45)
    ]),
    photo: new FormControl(),

    vehicletype: new FormControl(null, [
      Validators.required,
    ]),

    vehiclestatus: new FormControl(null, [
      Validators.required,
    ]),
  });

  get descriptionField(): FormControl {
    return this.form.controls.description as FormControl;
  }

  get noField(): FormControl {
    return this.form.controls.no as FormControl;
  }

  get brandField(): FormControl {
    return this.form.controls.brand as FormControl;
  }

  get modelField(): FormControl {
    return this.form.controls.model as FormControl;
  }

  get photoField(): FormControl {
    return this.form.controls.photo as FormControl;
  }

  get vehicletypeField(): FormControl {
    return this.form.controls.vehicletype as FormControl;
  }

  get vehiclestatusField(): FormControl {
    return this.form.controls.vehiclestatus as FormControl;
  }


  constructor(
    private vehicleService: VehicleService,
    private vehicletypeService: VehicletypeService,
    private vehiclestatusService: VehiclestatusService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private routeService: RouteService,
    private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

    async loadData(): Promise<any> {

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.vehicletypeService.getAll().then((vehicletype) => {
      this.vehicletypes = vehicletype;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.vehiclestatusService.getAll().then((vehiclestatuses) => {
      this.vehiclestatuses = vehiclestatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.vehicle = await this.vehicleService.get(this.selectedId);
    this.setValues();

  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_VEHICLE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_VEHICLES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_VEHICLE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_VEHICLE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_VEHICLE);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.photoField.pristine) {
      if (this.vehicle.photo) { this.photoField.setValue([this.vehicle.photo]); }
      else { this.photoField.setValue([]); }
    }

    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.vehicle.description);
    }
    if (this.noField.pristine) {
      this.noField.setValue(this.vehicle.no);
    }
    if (this.brandField.pristine) {
      this.brandField.setValue(this.vehicle.brand);
    }
    if (this.modelField.pristine) {
      this.modelField.setValue(this.vehicle.model);
    }
    if (this.vehicletypeField.pristine) {
      this.vehicletypeField.setValue(this.vehicle.vehicletype.id);
    }
    if (this.vehiclestatusField.pristine) {
      this.vehiclestatusField.setValue(this.vehicle.vehiclestatus.id);
    }
  }

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAllAsTouched();

    if (this.form.invalid) {return; }

    const newvehicle: Vehicle = new Vehicle();
    newvehicle.no = this.noField.value;

    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []) {
      newvehicle.photo = photoIds[0]; }
    else {
      newvehicle.photo = null;
    }

    newvehicle.description = this.descriptionField.value;
    newvehicle.no = this.noField.value;
    newvehicle.brand = this.brandField.value;
    newvehicle.model = this.modelField.value;
    newvehicle.vehicletype = this.vehicletypeField.value;
    newvehicle.vehiclestatus = this.vehiclestatusField.value;

    try{
      const resourceLink: ResourceLink = await this.vehicleService.update(this.selectedId, newvehicle);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/vehicles/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/vehicles');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.description) {
            this.descriptionField.setErrors({server: msg.description});
            knownError = true;
          }
          if (msg.no) {
            this.noField.setErrors({server: msg.no});
            knownError = true;
          }
          if (msg.brand) {
            this.brandField.setErrors({server: msg.brand});
            knownError = true;
          }
          if (msg.model) {
            this.modelField.setErrors({server: msg.model});
            knownError = true;
          }
          if (msg.vehicletype) {
            this.vehicletypeField.setErrors({server: msg.vehicletype});
            knownError = true;
          }
          if (msg.vehiclestatuses) {
            this.vehiclestatusField.setErrors({server: msg.vehiclestatuses});
            knownError = true;
          }
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
