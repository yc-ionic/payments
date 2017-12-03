[![Build Status](https://travis-ci.org/yc-ionic/payments.svg?branch=master)](https://travis-ci.org/yc-ionic/payments.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/yc-ionic/payments/badge.svg?branch=master)](https://coveralls.io/github/yc-ionic/payments?branch=master)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# @yci/payments

## Installation

1. Install the Ionic plugin
```
 npm i -S @yci/payments
```

2. Add it to your app’s NgModule.

```typescript
// Import your library
import { PaymentsModule } from '@yci/payments';

@NgModule({

  ...

  imports: [

    ...

    // Specify your library as an import
    PaymentsModule.forRoot()
  ],
  
  ...

})
export class AppModule { }
```

## Usage
Once your library is imported, you can use its service in your Angular application:

```ts
import { Payments } from '@yci/payments';

constructor(private payments: Payments) {

  payments.addChannel('alipay', async charge => {
    // ...
  });

  // pay
  payments.pay(target)

}
```

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

## License

MIT © [Yu Chen](mailto:yu.chen@live.ie)
