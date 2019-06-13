import {Injectable} from '@angular/core';
import {Place} from './place.model';
import {AuthService} from '../auth/auth.service';
import {BehaviorSubject} from 'rxjs';
import {delay, map, take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>([
    new Place('p1', 'Manhattan Mansion', 'In the heart of New York City.', 'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg', 149.99, new Date('2019-01-01'), new Date('2019-12-31'), 'abc'),
    new Place('p2', 'Amour Toujours', 'Romantic place in Paris.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/LuxembourgMontparnasse.JPG/1024px-LuxembourgMontparnasse.JPG', 189.99, new Date('2019-01-01'), new Date('2019-12-31'), 'abc'),
    new Place('p3', 'The Foggy Palace', 'Not your average city trip!', 'http://traveljapanblog.com/ashland/wp-content/uploads/2012/11/12N_1035-RAW-palace-of-the-fine-arts-san-francisco-night1.jpg', 99.99, new Date('2019-01-01'), new Date('2019-12-31'), 'abc'),
  ]) ;

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService) { }

  getPlace(id: string) {
    return this.places.pipe(take(1), map(places => {
      return {...places.find(p => p.id === id)};
    }));
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const newPlace = new Place(
        Math.random().toString(),
        title,
        description,
        'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
        price,
        dateFrom,
        dateTo,
        this.authService.userId);

    return this.places.pipe(
        take(1),
        delay(1000),
        tap(places => {
          this._places.next(places.concat(newPlace));
    }));
  }

  updatePlace(placeId, title: string, description: string) {
    return this.places.pipe(
        take(1),
        delay(1000),
        tap(places => {
          const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
          const updatedPlaces = [...places];
          const oldPlace = updatedPlaces[updatedPlaceIndex];
          updatedPlaces[updatedPlaceIndex] = new Place(
              oldPlace.id,
              title,
              description,
              oldPlace.imageUrl,
              oldPlace.price,
              oldPlace.availableFrom,
              oldPlace.availableTo,
              oldPlace.userId);
          this._places.next(updatedPlaces);
        })
    );
  }
}
