import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BranchService} from '../../../../services/branch.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {Branch} from '../../../../entities/branch';
import {Suppliertype} from '../../../../entities/suppliertype';
import {Branchtype} from '../../../../entities/branchtype';
import {SuppliertypeService} from '../../../../services/suppliertype.service';
import {BranchtypeService} from '../../../../services/branchtype.service';
import {Branchstatus} from '../../../../entities/branchstatus';
import {BranchstatusService} from '../../../../services/branchstatus.service';

@Component({
  selector: 'app-branch-form',
  templateUrl: './branch-form.component.html',
  styleUrls: ['./branch-form.component.scss']
})
export class BranchFormComponent extends AbstractComponent implements OnInit {

  branchtypes: Branchtype[] = [];

  branchstatuses: Branchstatus[] = [];


  form = new FormGroup({
    description: new FormControl(null, [
      Validators.maxLength(255),
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z]+(([\',. -][a-zA-Z ])?[a-zA-Z]*)*$')
    ]),


    tel1: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][0-9]{9})$'),
    ]),
    tel2: new FormControl(null, [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][0-9]{9})$'),
    ]),
    address: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(255),
    ]),
    email: new FormControl(null, [
      Validators.minLength(4),
      Validators.maxLength(255),
      Validators.pattern('^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$'),
    ]),
    fax: new FormControl(null, [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][0-9]{9})$'),
    ]),

    branchtype: new FormControl(null, [
      Validators.required,
    ]),


    branchstatus: new FormControl(null, [
      Validators.required,
    ]),

  });

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }


  get tel1Field(): FormControl{
    return this.form.controls.tel1 as FormControl;
  }

  get tel2Field(): FormControl{
    return this.form.controls.tel2 as FormControl;
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

  get branchtypeField(): FormControl{
    return this.form.controls.branchtype as FormControl;
  }

  get branchstatusField(): FormControl{
    return this.form.controls.branchstatus as FormControl;
  }


  constructor(
    private branchtypeService: BranchtypeService,
    private branchstatusService: BranchstatusService,
    private branchService: BranchService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.branchtypeService.getAll().then((branchtypes) => {
      this.branchtypes = branchtypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });


    this.branchstatusService.getAll().then((branchstatuses) => {
      this.branchstatuses = branchstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BRANCH);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_BRANCHES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_BRANCH_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BRANCH);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BRANCH);
  }



  async submit(): Promise<void> {

    if (this.form.invalid) { return; }

    const branch: Branch = new Branch();
    branch.description = this.descriptionField.value;
    branch.name = this.nameField.value;
    branch.tel1 = this.tel1Field.value;
    branch.tel2 = this.tel2Field.value;
    branch.address = this.addressField.value;
    branch.email = this.emailField.value;
    branch.fax = this.faxField.value;
    branch.branchtype = this.branchtypeField.value;
    branch.branchstatus = this.branchstatusField.value;


    try{
      const resourceLink: ResourceLink = await this.branchService.add(branch);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/branches/' + resourceLink.id);
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
          if (msg.tel1) { this.tel1Field.setErrors({server: msg.tel1}); knownError = true; }
          if (msg.tel2) { this.tel2Field.setErrors({server: msg.tel2}); knownError = true; }
          if (msg.address) { this.addressField.setErrors({server: msg.address}); knownError = true; }
          if (msg.email) { this.emailField.setErrors({server: msg.email}); knownError = true; }
          if (msg.fax) { this.faxField.setErrors({server: msg.fax}); knownError = true; }
          if (msg.branchtype) { this.branchtypeField.setErrors({server: msg.branchtype}); knownError = true; }
          if (msg.branchstatus) { this.branchstatusField.setErrors({server: msg.branchstatus}); knownError = true; }
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
