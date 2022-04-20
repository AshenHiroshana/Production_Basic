import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TrainingsessionService} from '../../../../services/trainingsession.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Trainingsession} from '../../../../entities/trainingsession';
import {ResourceLink} from '../../../../shared/resource-link';
import {Client} from '../../../../entities/client';
import {ClientService} from '../../../../services/client.service';
import {PageRequest} from '../../../../shared/page-request';
import {DateHelper} from '../../../../shared/date-helper';
import {Employee} from '../../../../entities/employee';
import {EmployeeService} from '../../../../services/employee.service';

@Component({
  selector: 'app-trainingsession-form',
  templateUrl: './trainingsession-form.component.html',
  styleUrls: ['./trainingsession-form.component.scss']
})
export class TrainingsessionFormComponent extends AbstractComponent implements OnInit {

  clients: Client[] = [];
  employees: Employee[] = [];

  form = new FormGroup({
    description: new FormControl(null, [
      Validators.maxLength(65535),
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    stime: new FormControl(null, [
      Validators.required,
    ]),
    etime: new FormControl(null, [
      Validators.required,
    ]),
    venue: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255),
    ]),
    client: new FormControl(null, [
      Validators.required,
    ]),
    employees: new FormControl()
  });

  getEmployeeName = (employees: Employee) => {
    return employees.callingname;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }
  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }
  get stimeField(): FormControl{
    return this.form.controls.stime as FormControl;
  }
  get etimeField(): FormControl{
    return this.form.controls.etime as FormControl;
  }

  get venueField(): FormControl{
    return this.form.controls.venue as FormControl;
  }
  get clientField(): FormControl{
    return this.form.controls.client as FormControl;
  }
  get employeesField(): FormControl{
    return this.form.controls.employees as FormControl;
  }

  constructor(
    private trainingsessionService: TrainingsessionService,
    private snackBar: MatSnackBar,
    private router: Router,
    private clientService: ClientService,
    private employeeService: EmployeeService) { super(); }

  // 5. create ngOnInit method.

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
    this.employeeService.getAllBasic(new PageRequest()).then((employees) => {
      this.employees = employees.content.filter((employee) => {
        return employee.employeestatus.id === 1;
      });
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  // 6. create loadData method.
  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.clientService.getAllBasic(new PageRequest()).then((clientDataPage) => {
      this.clients = clientDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

  }

  // 7. create userPrivilege method.
  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_TRAININGSESSION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_TRAININGSESSIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_TRAININGSESSION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_TRAININGSESSION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_TRAININGSESSION);
  }

  // 8. CREATE SUBMIT METHOD.

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const trainingsession: Trainingsession = new Trainingsession();
    trainingsession.description = this.descriptionField.value;
    trainingsession.date = DateHelper.getDateAsString(this.dateField.value);
    trainingsession.stime = this.stimeField.value;
    trainingsession.etime = this.etimeField.value;
    trainingsession.venue = this.venueField.value;
    trainingsession.client = this.clientField.value;
    trainingsession.employeeList = this.employeesField.value;

    try{
      const resourceLink: ResourceLink = await this.trainingsessionService.add(trainingsession);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/trainingsessions/' + resourceLink.id);
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
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.stime) { this.stimeField.setErrors({server: msg.stime}); knownError = true; }
          if (msg.etime) { this.etimeField.setErrors({server: msg.etime}); knownError = true; }
          if (msg.venue) { this.venueField.setErrors({server: msg.venue}); knownError = true; }
          if (msg.client) { this.clientField.setErrors({server: msg.client}); knownError = true; }
          if (msg.employees) { this.employeesField.setErrors({server: msg.employees}); knownError = true; }
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
