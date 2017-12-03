import { async, fakeAsync, tick, inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, ResponseType } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Storage } from '@ionic/storage';
import { CachedGet, CachedGetModule } from '../src/';
import 'rxjs/add/operator/map';

describe('CachedGet', () => {
  const storageStub = {
    get: (key: string): Promise<any> => {
      if (key === 'http://localhost/storage-error')
        return Promise.reject(new Error('StorageError'));
      return Promise.resolve(window.localStorage.getItem(key));
    },
    set: (key: string, value: any): Promise<any> => Promise.resolve(window.localStorage.setItem(key, value)),
    clear: (): Promise<void> => Promise.resolve(window.localStorage.clear()),
    ready: (): Promise<void> => Promise.resolve()
  };
  let cg: CachedGet;
  let mb: MockBackend;

  beforeAll(() => {
    window.localStorage.clear();
  });

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
        { provide: Storage, useValue: storageStub }
      ],
      imports: [
        HttpModule,
        CachedGetModule.forRoot()
      ]
    });
  }));

  beforeEach(inject([CachedGet, MockBackend], (_cg, _mb) => {
    cg = _cg;
    mb = _mb;
  }));

  it('should be defined', () => {
    expect(cg).toBeDefined();
  });

  it('Should get something', fakeAsync(() => {
    let result;
    const mbSub = mb.connections.subscribe(conn => {
      conn.mockRespond(new Response(new ResponseOptions({
        body: {
          content: 'ok'
        }
      })));
    });
    cg.get('http://localhost')
      .map(x => JSON.parse(x))
      .subscribe(x => {
        result = x;
      });
    tick();
    mbSub.unsubscribe();
    expect(result).toMatchObject({
      content: 'ok'
    });
  }));

  it('Should use cashed data', fakeAsync(() => {
    let results = [];
    const mbSub = mb.connections.subscribe((conn: MockConnection) => {
      conn.mockRespond(new Response(new ResponseOptions({
        body: {
          content: 'ok'
        },
      })));
    });

    cg.get('http://localhost')
      .map(x => JSON.parse(x))
      .subscribe(x => {
        results.push(x);
      });

    tick();
    mbSub.unsubscribe();
    expect(results).toMatchObject([
      {
        content: 'ok'
      }
    ]);
  }));

  it('Should use cached data and new data', fakeAsync(() => {
    let results = [];
    const mbSub = mb.connections.subscribe((conn: MockConnection) => {
      conn.mockRespond(new Response(new ResponseOptions({
        body: {
          content: 'ok again'
        }
      })));
    });

    cg.get('http://localhost')
      .map(x => JSON.parse(x))
      .subscribe(x => {
        results.push(x);
      });

    tick();
    mbSub.unsubscribe();
    expect(results).toMatchObject([
      {
        content: 'ok'
      },
      {
        content: 'ok again'
      }
    ]);
  }));

  it('Should throw an http error', fakeAsync(() => {
    class MockError extends Response implements Error {
      name: any
      message: any
    }
    const mbSub = mb.connections.subscribe((conn: MockConnection) => {
      conn.mockError(new MockError(new ResponseOptions({
        body: 'Not Found',
        type: ResponseType.Error,
        status: 404
      })));
    });

    let error;
    cg.get('http://localhost/not-found')
      .map(x => JSON.parse(x))
      .subscribe(x => { }, e => {
        error = e;
      });

    tick();
    mbSub.unsubscribe();
    expect(error.status).toBe(404);
  }));

  it('Should throw an storage error', fakeAsync(() => {
    let error;
    cg.get('http://localhost/storage-error')
      .map(x => JSON.parse(x))
      .subscribe(x => { }, e => {
        error = e;
      });
    tick();
    expect(error.message).toBe('StorageError');
  }));

  it('Should request with headers', fakeAsync(() => {
    cg.hashCode('');
    let result;
    const mbSub = mb.connections.subscribe((conn: MockConnection) => {
      conn.mockRespond(new Response(new ResponseOptions({
        body: conn.request.headers
      })));
    });
    cg.get('http://localhost', {'myheder': 'xxx'})
      .map(x => JSON.parse(x))
      .subscribe(x => {
        result = x;
      });
    tick();
    mbSub.unsubscribe();
    expect(result).toMatchObject({'myheder': ['xxx']});
  }));
});
