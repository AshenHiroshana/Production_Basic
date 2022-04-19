import { Component, OnInit } from '@angular/core';
import {Client} from '../../../../entities/client';
import {Route} from '../../../../entities/route';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ClientService} from '../../../../services/client.service';
import {RouteService} from '../../../../services/route.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {Clientstatus} from '../../../../entities/clientstatus';
import {ClientstatusService} from '../../../../services/clientstatus.service';
import {PageRequest} from '../../../../shared/page-request';

@Component({
  selector: 'app-client-update-form',
  templateUrl: './client-update-form.component.html',
  styleUrls: ['./client-update-form.component.scss']
})
export class ClientUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  client: Client;
  clientstatuses: Clientstatus [];
  routes: Route[] = [];

  form = new FormGroup({
    description: new FormControl(null, [
      Validators.maxLength(25535)
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255),
      Validators.pattern(
        '^[a-zA-Z]+(([\',. -][a-zA-Z ])?[a-zA-Z]*)*$')
    ]),
    contact1: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern(
        '^([0][1-9][0-9]{8})$'),
    ]),
    contact2: new FormControl(null, [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern(
        '^([0][1-9][0-9]{8})$'),
    ]),
    address: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(25535)
    ]),
    email: new FormControl(null, [
      Validators.minLength(3),
      Validators.maxLength(255),
      Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')
    ]),
    fax: new FormControl(null, [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][1-9][0-9]{8})$')
    ]),
    route: new FormControl(null, [
      Validators.required,
    ]),
    clientstatus: new FormControl(null, [
      Validators.required,
    ]),
  });
  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get contact1Field(): FormControl{
    return this.form.controls.contact1 as FormControl;
  }

  get contact2Field(): FormControl{
    return this.form.controls.contact2 as FormControl;
  }

  get addressField(): FormControl{
    return this.form.controls.address as FormControl;
  }

  get emailField(): FormControl{
    return this.form.controls.email as FormControl;
  }

  get faxField(): FormControl{
    return this.form.controls.fax as FormControl;
  }

  get routeField(): FormControl{
    return this.form.controls.route as FormControl;
  }

  get clientstatusFiled(): FormControl {
    return this.form.controls.route as FormControl;
  }

  constructor(
    public  clientService: ClientService,
    public  clientstatusService: ClientstatusService,
    private routeService: RouteService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }
  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.clientstatusService.getAll().then((clientstatuses) => {
      this.clientstatuses = clientstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.routeService.getAllBasic(new PageRequest()).then((routeDataPage) => {
      this.routes = routeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.client = await this.clientService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CLIENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CLIENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CLIENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CLIENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CLIENT);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.client.description);
    }
    if (this.nameField.pristine) {
      this.nameField.setValue(this.client.name);
    }
    if (this.contact1Field.pristine) {
      this.contact1Field.setValue(this.client.contact1);
    }
    if (this.contact2Field.pristine) {
      this.contact2Field.setValue(this.client.contact2);
    }
    if (this.addressField.pristine) {
      this.addressField.setValue(this.client.address);
    }
    if (this.emailField.pristine) {
      this.emailField.setValue(this.client.email);
    }
    if (this.faxField.pristine) {
      this.faxField.setValue(this.client.fax);
    }
    if (this.routeField.pristine) {
      this.routeField.setValue(this.client.route.id);
    }
    if (this.clientstatusFiled.pristine) {
      this.clientstatusFiled.setValue(this.client.route.id);
    }
  }

  async submit(): Promise<void> {
    // if (this.form.invalid) { return; }

    const newclient: Client = new Client();
    newclient.description = this.descriptionField.value;
    newclient.name = this.nameField.value;
    newclient.contact1 = this.contact1Field.value;
    newclient.contact2 = this.contact2Field.value;
    newclient.address = this.addressField.value;
    newclient.email = this.emailField.value;
    newclient.fax = this.faxField.value;
    newclient.route = this.routeField.value;
    newclient.clientstatus = this.clientstatusFiled.value;

    console.log(newclient);
    try{
      const resourceLink: ResourceLink = await this.clientService.update(this.selectedId, newclient);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/clients/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/clients/');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.contact1) { this.contact1Field.setErrors({server: msg.contact1}); knownError = true; }
          if (msg.contact2) { this.contact2Field.setErrors({server: msg.contact2}); knownError = true; }
          if (msg.address) { this.addressField.setErrors({server: msg.address}); knownError = true; }
          if (msg.email) { this.emailField.setErrors({server: msg.email}); knownError = true; }
          if (msg.fax) { this.faxField.setErrors({server: msg.fax}); knownError = true; }
          if (msg.route) { this.routeField.setErrors({server: msg.route}); knownError = true; }
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
