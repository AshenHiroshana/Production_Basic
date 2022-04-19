import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Paymentstatus} from '../entities/paymentstatus';

@Injectable({
  providedIn: 'root'
})
export class PaymentstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Paymentstatus[]>{
    const paymentstatuses = await this.http.get<Paymentstatus[]>(ApiManager.getURL('paymentstatuses')).toPromise();
    return paymentstatuses.map((paymentstatus) => Object.assign(new Paymentstatus(), paymentstatus));
  }

}
