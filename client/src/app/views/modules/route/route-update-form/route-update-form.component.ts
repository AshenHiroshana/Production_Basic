import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Supplier} from '../../../../entities/supplier';
import {Suppliertype} from '../../../../entities/suppliertype';
import {Supplierstatus} from '../../../../entities/supplierstatus';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SupplierService} from '../../../../services/supplier.service';
import {SuppliertypeService} from '../../../../services/suppliertype.service';
import {SupplierstatusService} from '../../../../services/supplierstatus.service';
import {RouteService} from '../../../../services/route.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {Route} from '../../../../entities/route';
import {Routestatus} from '../../../../entities/routestatus';
import {District} from '../../../../entities/district';
import {Vehicle} from '../../../../entities/vehicle';
import {Employee} from '../../../../entities/employee';
import {RoutestatusService} from '../../../../services/routestatus.service';
import {DistrictService} from '../../../../services/district.service';
import {VehicleService} from '../../../../services/vehicle.service';
import {EmployeeService} from '../../../../services/employee.service';
import {PageRequest} from '../../../../shared/page-request';

@Component({
  selector: 'app-route-update-form',
  templateUrl: './route-update-form.component.html',
  styleUrls: ['./route-update-form.component.scss']
})
export class RouteUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  route: Route;

  districts: District[] = [];
  routestatuses: Routestatus[] = [];
  vehicles: Vehicle[];
  refs: Employee[];

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
    routestatus: new FormControl(null, [
      Validators.required,
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


  get routestatusField(): FormControl {
    return this.form.controls.routestatus as FormControl;
  }


  constructor(
    private routestatusService: RoutestatusService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route1: ActivatedRoute,
    private routeService: RouteService,
    private districtService: DistrictService,
    private vehicleService: VehicleService,
    private refService: EmployeeService, ) {
    super();
  }

  ngOnInit(): void {
    this.route1.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any> {

    this.updatePrivileges();
    if (!this.privilege.add) {
      return;
    }

    this.districtService.getAll().then((district) => {
      this.districts = district;
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
    this.refService.getAllBasic(new PageRequest()).then((refDataPage) => {
      this.refs = refDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.routestatusService.getAll().then((routestatuses) => {
      this.routestatuses = routestatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.route = await this.routeService.get(this.selectedId);
    this.setValues();

  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ROUTE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ROUTES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ROUTE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ROUTE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ROUTE);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.route.description);
    }
    if (this.nameField.pristine) {
      this.nameField.setValue(this.route.name);
    }
    if (this.districtField.pristine) {
      this.districtField.setValue(this.route.district);
    }
    if (this.vehicleField.pristine) {
      this.vehicleField.setValue(this.route.vehicle);
    }
    if (this.refField.pristine) {
      this.refField.setValue(this.route.ref);
    }
    if (this.timegapField.pristine) {
      this.timegapField.setValue(this.route.timegap);
    }
    if (this.routestatusField.pristine) {
      this.routestatusField.setValue(this.route.routestatus.id);
    }
  }

  async submit(): Promise<void> {

    const newroute: Route = new Route();
    newroute.description = this.descriptionField.value;
    newroute.name = this.nameField.value;
    newroute.district = this.districtField.value;
    newroute.vehicle = this.vehicleField.value;
    newroute.ref = this.refField.value;
    newroute.timegap = this.timegapField.value;
    newroute.routestatus = this.routestatusField.value;

    try{
      const resourceLink: ResourceLink = await this.routeService.update(this.selectedId, newroute);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/routes/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/routes');
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
          if (msg.name) {
            this.nameField.setErrors({server: msg.name});
            knownError = true;
          }
          if (msg.district) {
            this.districtField.setErrors({server: msg.district});
            knownError = true;
          }
          if (msg.vehicle) {
            this.vehicleField.setErrors({server: msg.vehicle});
            knownError = true;
          }
          if (msg.ref) {
            this.refField.setErrors({server: msg.ref});
            knownError = true;
          }
          if (msg.timegap) {
            this.timegapField.setErrors({server: msg.timegap});
            knownError = true;
          }
          if (msg.routestatus) {
            this.routestatusField.setErrors({server: msg.routestatus});
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
