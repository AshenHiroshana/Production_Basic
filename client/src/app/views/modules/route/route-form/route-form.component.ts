import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {RouteService} from '../../../../services/route.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {District} from '../../../../entities/district';
import {Vehicle} from '../../../../entities/vehicle';
import {Employee} from '../../../../entities/employee';
import {DistrictService} from '../../../../services/district.service';
import {VehicleService} from '../../../../services/vehicle.service';
import {EmployeeService} from '../../../../services/employee.service';
import {PageRequest} from '../../../../shared/page-request';
import {Route} from '../../../../entities/route';

@Component({
  selector: 'app-route-form',
  templateUrl: './route-form.component.html',
  styleUrls: ['./route-form.component.scss']
})
export class RouteFormComponent extends AbstractComponent implements OnInit {


  private districts: District[] = [];
  private vehicles: Vehicle[] = [];
  private refs: Employee[] = [];

  form = new FormGroup({
    description: new FormControl(null, [
      Validators.maxLength(25535)
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255),
    ]),
    district: new FormControl(null, [
      Validators.required,
    ]),
    vehicle: new FormControl(null, [
      Validators.required,
    ]),
    ref: new FormControl(null, [
      Validators.required,
    ]),
    timegap: new FormControl(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(60),
      Validators.pattern('^([0-9]+)$')
    ]),
  });

  get descriptionField(): FormControl {
    return this.form.controls.description as FormControl;
  }

  get nameField(): FormControl {
    return this.form.controls.name as FormControl;
  }

  get districtField(): FormControl {
    return this.form.controls.district as FormControl;
  }

  get vehicleField(): FormControl {
    return this.form.controls.vehicle as FormControl;
  }

  get refField(): FormControl {
    return this.form.controls.ref as FormControl;
  }

  get timegapField(): FormControl {
    return this.form.controls.timegap as FormControl;
  }


  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private routeService: RouteService,
    private districtService: DistrictService,
    private vehicleService: VehicleService,
    private refService: EmployeeService,
) {
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

    this.districtService.getAll().then((districts) => {
      this.districts = districts;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.vehicleService.getAllBasic(new PageRequest()).then((vehicleDataPage) => {
      this.vehicles = vehicleDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.refService.findAllByDesignationAndeAndEmployeestatus(new PageRequest()).then((refDataPage) => {
      this.refs = refDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ROUTE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ROUTES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ROUTE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ROUTE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ROUTE);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      return;
    }

    const route: Route = new Route();
    route.description = this.descriptionField.value;
    route.name = this.nameField.value;
    route.district = this.districtField.value;
    route.vehicle = this.vehicleField.value;
    route.ref = this.refField.value;
    route.timegap = this.timegapField.value;

    try {
      console.log(route);
      const resourceLink: ResourceLink = await this.routeService.add(route);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/routes/' + resourceLink.id);
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
            knownError = false;
          }

          if (msg.description) {this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.name) {this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.vehicle) {this.vehicleField.setErrors({server: msg.vehicle}); knownError = true; }
          if (msg.ref) {this.refField.setErrors({server: msg.ref}); knownError = true; }
          if (msg.timegap) {this.timegapField.setErrors({server: msg.timegap}); knownError = true; }
          if (msg.district) {this.districtField.setErrors({server: msg.district}); knownError = true; }
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
