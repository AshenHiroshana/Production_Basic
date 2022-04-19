import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {ViewChild} from '@angular/core';
import {DateHelper} from '../../../../shared/date-helper';
import {MaterialdisposalmaterialSubFormComponent} from './materialdisposalmaterial-sub-form/materialdisposalmaterial-sub-form.component';
import {MaterialdisposalService} from "../../../../services/materialdisposal.service";
import {Materialdisposal} from "../../../../entities/materialdisposal";

@Component({
  selector: 'app-materialdisposal-form',
  templateUrl: './materialdisposal-form.component.html',
  styleUrls: ['./materialdisposal-form.component.scss']
})
export class MaterialdisposalFormComponent extends AbstractComponent implements OnInit {

  @ViewChild(MaterialdisposalmaterialSubFormComponent) materialdisposalmaterialSubForm: MaterialdisposalmaterialSubFormComponent;

  form = new FormGroup({
    date: new FormControl(null, [
      Validators.required,
    ]),
    materialdisposalmaterials: new FormControl(),
    reason: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get materialdisposalmaterialsField(): FormControl{
    return this.form.controls.materialdisposalmaterials as FormControl;
  }

  get reasonField(): FormControl{
    return this.form.controls.reason as FormControl;
  }

  constructor(
    private materialdisposalService: MaterialdisposalService,
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

  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MATERIALDISPOSAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MATERIALDISPOSALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MATERIALDISPOSAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MATERIALDISPOSAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MATERIALDISPOSAL);
  }

  async submit(): Promise<void> {
    this.materialdisposalmaterialSubForm.resetForm();
    this.materialdisposalmaterialsField.markAsDirty();
    if (this.form.invalid) { return; }

    const materialdisposal: Materialdisposal = new Materialdisposal();
    materialdisposal.date = DateHelper.getDateAsString(this.dateField.value);
    materialdisposal.materialdisposalmaterialList = this.materialdisposalmaterialsField.value;
    materialdisposal.reason = this.reasonField.value;
    try{
      const resourceLink: ResourceLink = await this.materialdisposalService.add(materialdisposal);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/materialdisposals/' + resourceLink.id);
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
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.materialdisposalmaterialList) { this.materialdisposalmaterialsField.setErrors({server: msg.materialdisposalmaterialList}); knownError = true; }
          if (msg.reason) { this.reasonField.setErrors({server: msg.reason}); knownError = true; }
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
