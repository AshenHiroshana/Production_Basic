import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Route, RouteDataPage} from '../entities/route';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<RouteDataPage>{
    const url = pageRequest.getPageRequestURL('routes');
    const routeDataPage = await this.http.get<RouteDataPage>(ApiManager.getURL(url)).toPromise();
    routeDataPage.content = routeDataPage.content.map((route) => Object.assign(new Route(), route));
    return routeDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<RouteDataPage>{
    const url = pageRequest.getPageRequestURL('routes/basic');
    const routeDataPage = await this.http.get<RouteDataPage>(ApiManager.getURL(url)).toPromise();
    routeDataPage.content = routeDataPage.content.map((route) => Object.assign(new Route(), route));
    return routeDataPage;
  }

  async get(id: number): Promise<Route>{
    const route: Route = await this.http.get<Route>(ApiManager.getURL(`routes/${id}`)).toPromise();
    return Object.assign(new Route(), route);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`routes/${id}`)).toPromise();
  }

  async add(route: Route): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`routes`), route).toPromise();
  }

  async update(id: number, route: Route): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`routes/${id}`), route).toPromise();
  }

}
