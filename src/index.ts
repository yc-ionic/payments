import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { Payments } from './service';

export * from './service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
  ],
  declarations: [
  ],
  exports: [
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class PaymentsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PaymentsModule,
      providers: [Payments]
    };
  }
}
