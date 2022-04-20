import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Trainingsession} from '../../../../entities/trainingsession';
import {Trainingsessionstatus} from '../../../../entities/trainingsessionstatus';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TrainingsessionService} from '../../../../services/trainingsession.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TrainingsessionstatusService} from '../../../../services/trainingsessionstatus.service';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {PageRequest} from '../../../../shared/page-request';
import {DateHelper} from '../../../../shared/date-helper';
import {Employee} from '../../../../entities/employee';
import {EmployeeService} from '../../../../services/employee.service';
import {Client} from '../../../../entities/client';
import {ClientService} from '../../../../services/client.service';

@Component({
  selector: 'app-trainingsession-update-form',
  templateUrl: './trainingsession-update-form.component.html',
  styleUrls: ['./trainingsession-update-form.component.scss']
})
export class TrainingsessionUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  trainingsession: Trainingsession;

  clients: Client[] = [];
  trainingsessionstatuses: Trainingsessionstatus[] = [];
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
    trainingsessionstatus: new FormControl(null, [
      Validators.required,
    ]),
    employees: new FormControl()
  });

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

  get trainingsessionstatusField(): FormControl{
    return this.form.controls.trainingsessionstatus as FormControl;
  }

  get employeesField(): FormControl{
    return this.form.controls.employees as FormControl;
  }

  constructor(
    private trainingsessionService: TrainingsessionService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    private clientService: ClientService,
    private trainingsessionstatusService: TrainingsessionstatusService,
    private employeeService: EmployeeService) { super(); }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
      this.employeeService.getAllBasic(new PageRequest()).then((employees) => {
        this.employees = employees.content.filter((employee) => {
          return employee.employeestatus.id === 1;
        });
      }).catch((e) => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });

    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.clientService.getAllBasic(new PageRequest()).then((clientDataPage) => {
      this.clients = clientDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.trainingsessionstatusService.getAll().then((trainingsessionstatuses) => {
      this.trainingsessionstatuses = trainingsessionstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.trainingsession = await this.trainingsessionService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_TRAININGSESSION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_TRAININGSESSIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_TRAININGSESSION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_TRAININGSESSION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_TRAININGSESSION);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.trainingsession.description);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.trainingsession.date);
    }
    if (this.stimeField.pristine) {
      this.stimeField.setValue(this.trainingsession.stime);
    }
    if (this.etimeField.pristine) {
      this.etimeField.setValue(this.trainingsession.etime);
    }
    if (this.venueField.pristine) {
      this.venueField.setValue(this.trainingsession.venue);
    }
    if (this.clientField.pristine) {
      this.clientField.setValue(this.trainingsession.client.id);
    }
    if (this.trainingsessionstatusField.pristine) {
      this.trainingsessionstatusField.setValue(this.trainingsession.trainingsessionstatus.id);
    }
    if (this.employeesField.pristine) {
      this.employeesField.setValue(this.trainingsession.employeeList);
    }

  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newtrainingsession: Trainingsession = new Trainingsession();
    newtrainingsession.date = DateHelper.getDateAsString(this.dateField.value);
    newtrainingsession.description = this.descriptionField.value;
    newtrainingsession.stime = this.stimeField.value;
    newtrainingsession.etime = this.etimeField.value;
    newtrainingsession.venue = this.venueField.value;
    newtrainingsession.client = this.clientField.value;
    newtrainingsession.trainingsessionstatus = this.trainingsessionstatusField.value;
    newtrainingsession.employeeList = this.employeesField.value;

    try{
      const resourceLink: ResourceLink = await this.trainingsessionService.update(this.selectedId, newtrainingsession);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/trainingsessions/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/trainingsessions');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.stime) { this.stimeField.setErrors({server: msg.stime}); knownError = true; }
          if (msg.etime) { this.etimeField.setErrors({server: msg.etime}); knownError = true; }
          if (msg.venue) { this.venueField.setErrors({server: msg.venue}); knownError = true; }
          if (msg.client) { this.clientField.setErrors({server: msg.client}); knownError = true; }
          if (msg.trainingsessionstatus) { this.trainingsessionstatusField.setErrors({server: msg.trainingsessionstatus}); knownError = true; }
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
