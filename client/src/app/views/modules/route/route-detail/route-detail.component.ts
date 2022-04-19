import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Route} from '../../../../entities/route';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {RouteService} from '../../../../services/route.service';

@Component({
  selector: 'app-route-detail',
  templateUrl: './route-detail.component.html',
  styleUrls: ['./route-detail.component.scss']
})
export class RouteDetailComponent extends AbstractComponent implements OnInit {

  route1: Route;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private routeService: RouteService,
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
      data: {message: this.route1.code + ' - ' + this.route1.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.routeService.delete(this.selectedId);
        await this.router.navigateByUrl('/routes');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.route1 = await this.routeService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ROUTE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ROUTES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ROUTE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ROUTE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ROUTE);
  }

}
