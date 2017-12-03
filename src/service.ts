import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Alipay } from './alipay';

export const EPaymentsChannel = {
  Alipay: 'alipay',
}

export interface IPaymentsTarget {
  isYcsTest: boolean;
  webhook?: string;
  channel: string;
  charge: any;
}

@Injectable()
export class Payments {
  constructor(
    private http: Http,
    private alipay: Alipay,
  ) { }

  pay(target: IPaymentsTarget) {
    if (target.isYcsTest) {
      return this.mockPay(target);
    }

    switch (target.channel) {
      case EPaymentsChannel.Alipay:
        return this.alipay.pay(target.charge);
      default:
        throw new Error('Unsupported payment channel');
    }
  }

  mockPay(target: IPaymentsTarget): Promise<Response> {
    return this.http.post(target.webhook, {}).toPromise();
  }
}
