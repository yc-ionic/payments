import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

export interface IPaymentsTarget {
  isYcsTest: boolean;
  webhook?: string;
  channel: string;
  charge: any;
}

@Injectable()
export class Payments {
  private channels: {
    [x: string]: (charge: any) => Promise<any>;
  } = {};

  constructor(
    private http: Http
  ) { }

  public addChannel(name: string, fn: (charge: any) => Promise<any>) {
    this.channels[name] = fn;
  }

  public pay(target: IPaymentsTarget): Promise<any> {
    if (target.isYcsTest) {
      return this.mockPay(target);
    }

    const fn = this.channels[target.channel];
    if (!fn)
      throw new Error('Unsupported payment channel');
    return fn(target.charge);
  }

  private mockPay(target: IPaymentsTarget): Promise<any> {
    return this.http.post(target.webhook, {}).map(x => x.json()).toPromise();
  }
}
