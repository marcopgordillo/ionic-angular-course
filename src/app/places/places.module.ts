import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {PlacesPage} from './places.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: PlacesPage,
    children: [
      { path: 'discover', children: [
          { path: '', loadChildren: './discover/discover.module#DiscoverPageModule' },
          { path: ':placeId', loadChildren: './discover/place-detail/place-detail.module#PlaceDetailPageModule' }
        ]
      },
      { path: 'offers', children: [
          { path: '', loadChildren: './offers/offers.module#OffersPageModule' },
          { path: 'new', loadChildren: './offers/new-offer/new-offer.module#NewOfferPageModule' },
          { path: 'edit/:placeId', loadChildren: './offers/edit-offer/edit-offer.module#EditOfferPageModule' },
          { path: ':placeId', loadChildren: './offers/offer-bookings/offer-bookings.module#OfferBookingsPageModule' }
        ]
      },
      { path: '', redirectTo: '/places/tabs/discover', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/places/tabs/discover', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PlacesPage]
})
export class PlacesPageModule {}
