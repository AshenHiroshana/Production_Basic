import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Materialdisposal} from "../../../../entities/materialdisposal";
import {MaterialdisposalService} from "../../../../services/materialdisposal.service";

@Component({
  selector: 'app-materialdisposal-detail',
  templateUrl: './materialdisposal-detail.component.html',
  styleUrls: ['./materialdisposal-detail.component.scss']
})
export class MaterialdisposalDetailComponent extends AbstractComponent implements OnInit {

  materialdisposal: Materialdisposal;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private materialdisposalService: MaterialdisposalService,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId = + params.get('id');
      try{
        await this.loadData();
      } finally {
        this.initialLoaded();
        this.refreshData();
      }
    });
  }

  async delete(): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: this.materialdisposal.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.materialdisposalService.delete(this.selectedId);
        await this.router.navigateByUrl('/materialdisposals');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.materialdisposal = await this.materialdisposalService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MATERIALDISPOSAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MATERIALDISPOSALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MATERIALDISPOSAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MATERIALDISPOSAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MATERIALDISPOSAL);
  }
}
