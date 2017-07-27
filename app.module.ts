import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { HeroListComponent } from './hero-list/hero-list.component';
import { HeroComponent } from './hero/hero.component';
import { APP_BASE_HREF, Location, LocationStrategy, HashLocationStrategy } from '@angular/common';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'hero' },
  { path: 'herolist', component: HeroListComponent },
  { path: 'hero', component: HeroComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HeroListComponent,
    HeroComponent
  ],

  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes, { enableTracing: true })
  ],

  providers: [
    // { provide: APP_BASE_HREF, useValue: '/sites/angular2/SitePages/weather.aspx' },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
