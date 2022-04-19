import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Paymenttype} from '../entities/paymenttype';

@Injectable({
  providedIn: 'root'
})
export class PaymenttypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Paymenttype[]>{
    const paymenttypes = await this.http.get<Paymenttype[]>(ApiManager.getURL('paymenttypes')).toPromise();
    return paymenttypes.map((paymenttype) => Object.assign(new Paymenttype(), paymenttype));
  }

}
