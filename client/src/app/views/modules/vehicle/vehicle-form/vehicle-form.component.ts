import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Vehicletype} from '../../../../entities/vehicletype';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {VehicleService} from '../../../../services/vehicle.service';
import {VehicletypeService} from '../../../../services/vehicletype.service';
import {RouteService} from '../../../../services/route.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Vehicle} from '../../../../entities/vehicle';
import {ResourceLink} from '../../../../shared/resource-link';
import {VehiclestatusService} from '../../../../services/vehiclestatus.service';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss']
})
export class VehicleFormComponent extends AbstractComponent implements OnInit {

  private vehicletypes: Vehicletype[] = [];

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

  constructor(
    private vehicleService: VehicleService,
    private vehicletypeService: VehicletypeService,
    private vehiclestatusService: VehiclestatusService,
    private snackBar: MatSnackBar,
    private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {

    this.updatePrivileges();
    if (!this.privilege.add) {
      return;
    }

    this.vehicletypeService.getAll().then((vehicletype) => {
      this.vehicletypes = vehicletype;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_VEHICLE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_VEHICLES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_VEHICLE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_VEHICLE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_VEHICLE);
  }

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAllAsTouched();

    if (this.form.invalid) {return; }

    const vehicle: Vehicle = new Vehicle();

    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []) {
      vehicle.photo = photoIds[0]; }
    else {
      vehicle.photo = null;
    }

    vehicle.description = this.descriptionField.value;
    vehicle.no = this.noField.value;
    vehicle.brand = this.brandField.value;
    vehicle.model = this.modelField.value;
    vehicle.vehicletype = this.vehicletypeField.value;

    try {
      console.log(vehicle);
      const resourceLink: ResourceLink = await this.vehicleService.add(vehicle);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/vehicles/' + resourceLink.id);
      } else {
        this.form.reset();
        this.snackBar.open('Successfully saved', null, {duration: 2000});
      }
    } catch (e) {
      switch (e.status) {
        case 401:
          break;
        case 403:
          this.snackBar.open(e.error.message, null, {duration: 2000});
          break;
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
