import { async, fakeAsync, tick, inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, ResponseType } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Payments, PaymentsModule } from '../src/';

describe('Payments', () => {
  let payments: Payments;
  let mb: MockBackend;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
      ],
      imports: [
        HttpModule,
        PaymentsModule.forRoot()
      ]
    });
  }));

  beforeEach(inject([Payments, MockBackend], (_payments, _mb) => {
    payments = _payments;
    mb = _mb;
  }));

  it('should be defined', () => {
    expect(payments).toBeDefined();
  });

  it('should add channels', async () => {
    payments.addChannel('alipay', async charge => {
      return true;
    });
    const res = await payments.pay({
      isYcsTest: false,
      channel: 'alipay',
      charge: ''
    })
    expect(res).toBe(true);
  });

  it('should add channels', async () => {
    payments.addChannel('alipay', async charge => {
      return true;
    });
    const res = await payments.pay({
      isYcsTest: false,
      channel: 'alipay',
      charge: ''
    })
    expect(res).toBe(true);
  });

  it('Should use mockpay', fakeAsync(async () => {
    const mbSub = mb.connections.subscribe((conn: MockConnection) => {
      conn.mockRespond(new Response(new ResponseOptions({
        body: {
          content: 'ok'
        },
      })));
    });

    const res = await payments.pay({
      isYcsTest: true,
      channel: 'alipay',
      webhook: 'http://localhost',
      charge: ''
    });

    tick();
    mbSub.unsubscribe();
    expect(res).toMatchObject(
      {
        content: 'ok'
      });
  }));

  it('sould throw unsupported channel error', async () => {
    let err: Error;
    try {
      await payments.pay({
        isYcsTest: false,
        channel: 'unknown',
        charge: ''
      });
    } catch(e) {
      err = e;
    }
    expect(err.message).toMatch('Unsupported payment channel');
  });

  //   it('Should use cached data and new data', fakeAsync(() => {
  //     let results = [];
  //     const mbSub = mb.connections.subscribe((conn: MockConnection) => {
  //       conn.mockRespond(new Response(new ResponseOptions({
  //         body: {
  //           content: 'ok again'
  //         }
  //       })));
  //     });

  //     cg.get('http://localhost')
  //       .map(x => JSON.parse(x))
  //       .subscribe(x => {
  //         results.push(x);
  //       });

  //     tick();
  //     mbSub.unsubscribe();
  //     expect(results).toMatchObject([
  //       {
  //         content: 'ok'
  //       },
  //       {
  //         content: 'ok again'
  //       }
  //     ]);
  //   }));

  //   it('Should throw an http error', fakeAsync(() => {
  //     class MockError extends Response implements Error {
  //       name: any
  //       message: any
  //     }
  //     const mbSub = mb.connections.subscribe((conn: MockConnection) => {
  //       conn.mockError(new MockError(new ResponseOptions({
  //         body: 'Not Found',
  //         type: ResponseType.Error,
  //         status: 404
  //       })));
  //     });

  //     let error;
  //     cg.get('http://localhost/not-found')
  //       .map(x => JSON.parse(x))
  //       .subscribe(x => { }, e => {
  //         error = e;
  //       });

  //     tick();
  //     mbSub.unsubscribe();
  //     expect(error.status).toBe(404);
  //   }));

  //   it('Should throw an storage error', fakeAsync(() => {
  //     let error;
  //     cg.get('http://localhost/storage-error')
  //       .map(x => JSON.parse(x))
  //       .subscribe(x => { }, e => {
  //         error = e;
  //       });
  //     tick();
  //     expect(error.message).toBe('StorageError');
  //   }));

  //   it('Should request with headers', fakeAsync(() => {
  //     cg.hashCode('');
  //     let result;
  //     const mbSub = mb.connections.subscribe((conn: MockConnection) => {
  //       conn.mockRespond(new Response(new ResponseOptions({
  //         body: conn.request.headers
  //       })));
  //     });
  //     cg.get('http://localhost', {'myheder': 'xxx'})
  //       .map(x => JSON.parse(x))
  //       .subscribe(x => {
  //         result = x;
  //       });
  //     tick();
  //     mbSub.unsubscribe();
  //     expect(result).toMatchObject({'myheder': ['xxx']});
  //   }));
});
