import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ClientService} from '../../../../services/client.service';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {Client} from '../../../../entities/client';
import {Router} from '@angular/router';
import {PageRequest} from '../../../../shared/page-request';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent extends AbstractComponent implements OnInit {



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

  constructor(
    public  clientService: ClientService,
    private snackBar: MatSnackBar,
    private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }
      }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CLIENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CLIENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CLIENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CLIENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CLIENT);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const client: Client = new Client();
    client.description = this.descriptionField.value;
    client.name = this.nameField.value;
    client.contact1 = this.contact1Field.value;
    client.contact2 = this.contact2Field.value;
    client.address = this.addressField.value;
    client.email = this.emailField.value;
    client.fax = this.faxField.value;

    try{
      const resourceLink: ResourceLink = await this.clientService.add(client);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/clients/' + resourceLink.id);
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
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.contact1) { this.contact1Field.setErrors({server: msg.contact1}); knownError = true; }
          if (msg.contact2) { this.contact2Field.setErrors({server: msg.contact2}); knownError = true; }
          if (msg.address) { this.addressField.setErrors({server: msg.address}); knownError = true; }
          if (msg.email) { this.emailField.setErrors({server: msg.email}); knownError = true; }
          if (msg.fax) { this.faxField.setErrors({server: msg.fax}); knownError = true; }
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
