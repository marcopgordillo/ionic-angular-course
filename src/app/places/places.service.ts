import {Injectable} from '@angular/core';
import {Place} from './place.model';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places: Place[] = [
    new Place('p1', 'Manhattan Mansion', 'In the heart of New York City.', 'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg', 149.99, new Date('2019-01-01'), new Date('2019-12-31'), 'abc'),
    new Place('p2', 'Amour Toujours', 'Romantic place in Paris.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/LuxembourgMontparnasse.JPG/1024px-LuxembourgMontparnasse.JPG', 189.99, new Date('2019-01-01'), new Date('2019-12-31'), 'abc'),
    new Place('p3', 'The Foggy Palace', 'Not your average city trip!', 'http://traveljapanblog.com/ashland/wp-content/uploads/2012/11/12N_1035-RAW-palace-of-the-fine-arts-san-francisco-night1.jpg', 99.99, new Date('2019-01-01'), new Date('2019-12-31'), 'abc'),
  ];

  get places() {
    return [...this._places];
  }

  constructor(private authService: AuthService) { }

  getPlace(id: string): Place {
    return {...this._places.find(p => p.id === id)};
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const newPlace = new Place(Math.random().toString(), title, description, 'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg', price, dateFrom, dateTo, this.authService.userId);
    this._places.push(newPlace);
  }
}
