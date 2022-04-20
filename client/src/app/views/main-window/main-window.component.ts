import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {TokenManager} from '../../shared/security/token-manager';
import {AuthenticationService} from '../../shared/authentication.service';
import {LoggedUser} from '../../shared/logged-user';
import {LinkItem} from '../../shared/link-item';
import {ThemeManager} from '../../shared/views/theme-manager';
import {UsecaseList} from '../../usecase-list';
import {NotificationService} from '../../services/notification.service';
import {PrimeNumbers} from '../../shared/prime-numbers';
import {Notification} from '../../entities/notification';

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.scss']
})
export class MainWindowComponent implements OnInit, OnDestroy {

  constructor(
    private userService: UserService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService
  ) {
    if (!TokenManager.isContainsToken()){
      this.router.navigateByUrl('/login');
    }
  }

  get loggedUserName(): string{
    return LoggedUser.getName();
  }

  get loggedUserPhoto(): string{
    return LoggedUser.getPhoto();
  }

  refreshRate = PrimeNumbers.getRandomNumber();
  unreadNotificationCount = '0';
  isLive = true;
  sidenavOpen = false;
  sidenaveMode = 'side';
  usecasesLoaded = false;
  linkItems: LinkItem[] = [];
  isDark: boolean;
  latestNotifications: Notification[] = [];

  async loadData(): Promise<void>{
    this.notificationService.getUnreadCount().then((count) => {
      if (count > 99) { this.unreadNotificationCount = '99+'; }
      else{ this.unreadNotificationCount = count.toString(); }
    }).catch((e) => {
      console.log(e);
    });

    this.notificationService.getLatest().then(async (data) => {
      this.latestNotifications = data;
      for (const notification of data){
        if (!notification.dodelivered){
          await this.notificationService.setDelivered(notification.id);
        }
      }
    }).catch((e) => {
      console.log(e);
    });

  }

  setNotificationsAsRead(): void{
    for (const notification of this.latestNotifications){
      if (!notification.doread){
        this.notificationService.setRead(notification.id);
      }
    }
  }

  refreshData(): void{
    setTimeout( async () => {
      if (!this.isLive) { return; }
      try{
        await this.loadData();
      }finally {
        this.refreshData();
      }
    }, this.refreshRate);
  }

  async ngOnInit(): Promise<void> {
    this.userService.me().then((user) => {
      LoggedUser.user = user;
    });
    this.userService.myUsecases().then((usecases) => {
      LoggedUser.usecases = usecases;
      this.setLinkItems();
      this.usecasesLoaded = true;
    });
    this.setSidenavSettings();
    this.isDark = ThemeManager.isDark();
    await this.loadData();
    this.refreshData();
  }

  async logout(): Promise<void>{
    await this.authenticationService.destroyToken();
    TokenManager.destroyToken();
    LoggedUser.clear();
    this.router.navigateByUrl('/login');
  }

  setSidenavSettings(): void{
    const width = window.innerWidth;
    if (width < 992){
      this.sidenavOpen = false;
      this.sidenaveMode = 'over';
    }else{
      this.sidenavOpen = true;
      this.sidenaveMode = 'side';
    }
  }

  private setLinkItems(): void{
    const dashboardLink = new LinkItem('Dashboard', '/', 'dashboard');
    const userLink = new LinkItem('User Management', '', 'admin_panel_settings');
    const roleLink = new LinkItem('Role Management', '', 'assignment_ind');
    const clientLink = new LinkItem('Client Management', '', 'supervised_user_circle');
    const supplierLink = new LinkItem('Supplier Management', '', 'local_shipping');
    const employeeLink = new LinkItem('Employee Management', '/', 'trip_origin');
    const routeLink = new LinkItem('Route Management', '/', 'directions');
    const vehicleLink = new LinkItem('Vehicle Management', '/', 'commute');
    const purchaseLink = new LinkItem('Purchase Management', '/', 'shopping_cart');
    const materialLink = new LinkItem('Material Management', '/', 'store');
    const porderLink = new LinkItem('Purchase Order Management', '/', 'queue');
    const supplierpaymentLink = new LinkItem('Supplier Payment Management', '/', 'payment');
    const materialdisposalLink = new LinkItem('Material Disposal Management', '/', 'delete_forever');
    const productLink = new LinkItem('Product Management', '', 'list_alt');
    const trainingsessionLink = new LinkItem('Training Session Management', '', 'store');

    const showUserLink = new LinkItem('Show All Users', '/users', 'list');
    showUserLink.addUsecaseId(UsecaseList.SHOW_ALL_USERS);
    userLink.children.push(showUserLink);

    const addUserLink = new LinkItem('Add New User', '/users/add', 'add');
    addUserLink.addUsecaseId(UsecaseList.ADD_USER);
    userLink.children.push(addUserLink);

    const showRoleLink = new LinkItem('Show All Roles', '/roles', 'list');
    showRoleLink.addUsecaseId(UsecaseList.SHOW_ALL_ROLES);
    roleLink.children.push(showRoleLink);

    const addRoleLink = new LinkItem('Add New Role', '/roles/add', 'add');
    addRoleLink.addUsecaseId(UsecaseList.ADD_ROLE);
    roleLink.children.push(addRoleLink);

    const addNewEmployeeLink = new LinkItem('Add New Employee', 'employees/add', 'add');
    addNewEmployeeLink.addUsecaseId(UsecaseList.ADD_EMPLOYEE);
    employeeLink.children.push(addNewEmployeeLink);

    const showAllEmployeeLink = new LinkItem('Show All Employee', 'employees', 'list');
    showAllEmployeeLink.addUsecaseId(UsecaseList.SHOW_ALL_EMPLOYEES);
    employeeLink.children.push(showAllEmployeeLink);

    const addNewClientLink = new LinkItem('Add New Client', 'clients/add', 'add');
    addNewClientLink.addUsecaseId(UsecaseList.ADD_CLIENT);
    clientLink.children.push(addNewClientLink);

    const showAllClientLink = new LinkItem('Show All Client', 'clients', 'list');
    showAllClientLink.addUsecaseId(UsecaseList.SHOW_ALL_CLIENTS);
    clientLink.children.push(showAllClientLink);

    const addNewSupplierLink = new LinkItem('Add New Supplier', 'suppliers/add', 'add');
    addNewSupplierLink.addUsecaseId(UsecaseList.ADD_SUPPLIER);
    supplierLink.children.push(addNewSupplierLink);

    const showAllSupplierLink = new LinkItem('Show All Supplier', 'suppliers', 'list');
    showAllSupplierLink.addUsecaseId(UsecaseList.SHOW_ALL_SUPPLIERS);
    supplierLink.children.push(showAllSupplierLink);

    const addNewRouteLink = new LinkItem('Add New Route', 'routes/add', 'add');
    addNewRouteLink.addUsecaseId(UsecaseList.ADD_ROUTE);
    routeLink.children.push(addNewRouteLink);

    const showAllRouteLink = new LinkItem('Show All Route', 'routes', 'list');
    showAllRouteLink.addUsecaseId(UsecaseList.SHOW_ALL_ROUTES);
    routeLink.children.push(showAllRouteLink);

    const addNewVehicleLink = new LinkItem('Add New Vehicle', 'vehicles/add', 'add');
    addNewVehicleLink.addUsecaseId(UsecaseList.ADD_VEHICLE);
    vehicleLink.children.push(addNewVehicleLink);

    const showAllVehicleLink = new LinkItem('Show All Vehicle', 'vehicles', 'list');
    showAllVehicleLink.addUsecaseId(UsecaseList.SHOW_ALL_VEHICLES);
    vehicleLink.children.push(showAllVehicleLink);

    const addNewPurchaseLink = new LinkItem('Add New Purchase', 'purchases/add', 'add');
    addNewPurchaseLink.addUsecaseId(UsecaseList.ADD_PURCHASE);
    purchaseLink.children.push(addNewPurchaseLink);

    const showAllPurchaseLink = new LinkItem('Show All Purchases', 'purchases', 'list');
    showAllPurchaseLink.addUsecaseId(UsecaseList.SHOW_ALL_PURCHASES);
    purchaseLink.children.push(showAllPurchaseLink);

    const addNewMaterialLink = new LinkItem('Add New Material', 'materials/add', 'add');
    addNewMaterialLink.addUsecaseId(UsecaseList.ADD_MATERIAL);
    materialLink.children.push(addNewMaterialLink);

    const showAllMaterialLink = new LinkItem('Show All Materials', 'materials', 'list');
    showAllMaterialLink.addUsecaseId(UsecaseList.SHOW_ALL_MATERIALS);
    materialLink.children.push(showAllMaterialLink);

    const addNewPorderLink = new LinkItem('Add New Purchase Order', 'porders/add', 'add');
    addNewPorderLink.addUsecaseId(UsecaseList.ADD_PORDER);
    porderLink.children.push(addNewPorderLink);

    const showAllPorderLink = new LinkItem('Show All Purchase Orders', 'porders', 'list');
    showAllPorderLink.addUsecaseId(UsecaseList.SHOW_ALL_PORDERS);
    porderLink.children.push(showAllPorderLink);

    const addNewSupplierpaymentLink = new LinkItem('Add New Supplier Payment', 'supplierpayments/add', 'add');
    addNewSupplierpaymentLink.addUsecaseId(UsecaseList.ADD_SUPPLIERPAYMENT);
    supplierpaymentLink.children.push(addNewSupplierpaymentLink);

    const showAllSupplierpaymentLink = new LinkItem('Show All Supplier Payments', 'supplierpayments', 'list');
    showAllSupplierpaymentLink.addUsecaseId(UsecaseList.SHOW_ALL_SUPPLIERPAYMENTS);
    supplierpaymentLink.children.push(showAllSupplierpaymentLink);

    const addNewMaterialdisposalLink = new LinkItem('Add New Material Disposal', 'materialdisposals/add', 'add');
    addNewMaterialdisposalLink.addUsecaseId(UsecaseList.ADD_MATERIALDISPOSAL);
    materialdisposalLink.children.push(addNewMaterialdisposalLink);

    const showAllMaterialdisposalLink = new LinkItem('Show All Material Disposals', 'materialdisposals', 'list');
    showAllMaterialdisposalLink.addUsecaseId(UsecaseList.SHOW_ALL_MATERIALDISPOSALS);
    materialdisposalLink.children.push(showAllMaterialdisposalLink);

    const addNewProductLink = new LinkItem('Add New Product', 'products/add', 'add');
    addNewProductLink.addUsecaseId(UsecaseList.ADD_PRODUCT);
    productLink.children.push(addNewProductLink);

    const showAllProductLink = new LinkItem('Show All Product', 'products', 'list');
    showAllProductLink.addUsecaseId(UsecaseList.SHOW_ALL_PRODUCTS);
    productLink.children.push(showAllProductLink);

    const addNewTrainingsessionLink = new LinkItem('Add New Trainingsession', 'trainingsessions/add', 'add');
    addNewTrainingsessionLink.addUsecaseId(UsecaseList.ADD_TRAININGSESSION);
    trainingsessionLink.children.push(addNewTrainingsessionLink);

    const showAllTrainingsessionLink = new LinkItem('Show All Trainingsession', 'trainingsessions', 'list');
    showAllTrainingsessionLink.addUsecaseId(UsecaseList.SHOW_ALL_TRAININGSESSIONS);
    trainingsessionLink.children.push(showAllTrainingsessionLink);


    this.linkItems.push(dashboardLink);
    this.linkItems.push(userLink);
    this.linkItems.push(roleLink);
    this.linkItems.push(employeeLink);
    this.linkItems.push(clientLink);
    this.linkItems.push(supplierLink);
    this.linkItems.push(routeLink);
    this.linkItems.push(vehicleLink);

    this.linkItems.push(materialLink);
    this.linkItems.push(porderLink);
    this.linkItems.push(purchaseLink);
    this.linkItems.push(supplierpaymentLink);
    this.linkItems.push(materialdisposalLink);
    this.linkItems.push(productLink);
    this.linkItems.push(trainingsessionLink);
  }

  changeTheme(e): void{
    if (e.checked){
      ThemeManager.setDark(true);
      this.isDark = true;
    }else{
      ThemeManager.setDark(false);
      this.isDark = false;
    }
  }

  ngOnDestroy(): void {
    this.isLive = false;
  }
}
