import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDatabase } from '../in-memory-database';
import { TopNavbarComponent } from './components/top-navbar/top-navbar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [TopNavbarComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDatabase),
    RouterModule,
  ], exports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TopNavbarComponent
  ]
})
export class CoreModule { }
