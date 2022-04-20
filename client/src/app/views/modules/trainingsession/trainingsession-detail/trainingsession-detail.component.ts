import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Trainingsession} from '../../../../entities/trainingsession';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {TrainingsessionService} from '../../../../services/trainingsession.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';

@Component({
  selector: 'app-trainingsession-detail',
  templateUrl: './trainingsession-detail.component.html',
  styleUrls: ['./trainingsession-detail.component.scss']
})
export class TrainingsessionDetailComponent extends AbstractComponent implements OnInit {

  trainingsession: Trainingsession;
  selectedId: number;


  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private trainingsessionService: TrainingsessionService,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void{
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
      data: {message: this.trainingsession.code + '-' + this.trainingsession.date}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.trainingsessionService.delete(this.selectedId);
        await this.router.navigateByUrl('/trainingsessions');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.trainingsession = await this.trainingsessionService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_TRAININGSESSION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_TRAININGSESSIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_TRAININGSESSION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_TRAININGSESSION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_TRAININGSESSION);
  }

}
