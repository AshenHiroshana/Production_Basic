import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {ViewChild} from '@angular/core';
import {DateHelper} from '../../../../shared/date-helper';
import {MaterialdisposalmaterialUpdateSubFormComponent} from './materialdisposalmaterial-update-sub-form/materialdisposalmaterial-update-sub-form.component';
import {Materialdisposal} from "../../../../entities/materialdisposal";
import {MaterialdisposalService} from "../../../../services/materialdisposal.service";

@Component({
  selector: 'app-materialdisposal-update-form',
  templateUrl: './materialdisposal-update-form.component.html',
  styleUrls: ['./materialdisposal-update-form.component.scss']
})
export class MaterialdisposalUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  materialdisposal: Materialdisposal;

  @ViewChild(MaterialdisposalmaterialUpdateSubFormComponent) materialdisposalmaterialUpdateSubForm: MaterialdisposalmaterialUpdateSubFormComponent;

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
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
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
    if (!this.privilege.update) { return; }

    this.materialdisposal = await this.materialdisposalService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MATERIALDISPOSAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MATERIALDISPOSALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MATERIALDISPOSAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MATERIALDISPOSAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MATERIALDISPOSAL);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.dateField.pristine) {
      this.dateField.setValue(this.materialdisposal.date);
    }
    if (this.materialdisposalmaterialsField.pristine) {
      this.materialdisposalmaterialsField.setValue(this.materialdisposal.materialdisposalmaterialList);
    }
    if (this.reasonField.pristine) {
      this.reasonField.setValue(this.materialdisposal.reason);
    }
}

  async submit(): Promise<void> {
    this.materialdisposalmaterialUpdateSubForm.resetForm();
    this.materialdisposalmaterialsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newmaterialdisposal: Materialdisposal = new Materialdisposal();
    newmaterialdisposal.date = DateHelper.getDateAsString(this.dateField.value);
    newmaterialdisposal.materialdisposalmaterialList = this.materialdisposalmaterialsField.value;
    newmaterialdisposal.reason = this.reasonField.value;
    try{
      const resourceLink: ResourceLink = await this.materialdisposalService.update(this.selectedId, newmaterialdisposal);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/materialdisposals/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/materialdisposals');
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
