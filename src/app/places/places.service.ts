import {Injectable} from '@angular/core';
import {Place} from './place.model';
import {AuthService} from '../auth/auth.service';
import {BehaviorSubject, of} from 'rxjs';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

/*new Place('p1', 'Manhattan Mansion', 'In the heart of New York City.', 'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg', 149.99, new Date('2019-01-01'), new Date('2019-12-31'), 'xyz'),
    new Place('p2', 'Amour Toujours', 'Romantic place in Paris.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/LuxembourgMontparnasse.JPG/1024px-LuxembourgMontparnasse.JPG', 189.99, new Date('2019-01-01'), new Date('2019-12-31'), 'abc'),
    new Place('p3', 'The Foggy Palace', 'Not your average city trip!', 'http://traveljapanblog.com/ashland/wp-content/uploads/2012/11/12N_1035-RAW-palace-of-the-fine-arts-san-francisco-night1.jpg', 99.99, new Date('2019-01-01'), new Date('2019-12-31'), 'abc')*/

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private API_URL: string = environment.apiUrl;

  private _places = new BehaviorSubject<Place[]>([]) ;

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService,
              private http: HttpClient) { }

  getPlace(id: string) {
    return this.http
        .get<PlaceData>(`${this.API_URL}/offered-places/${id}.json`)
        .pipe(
            map(placeData => {
              return new Place(
                  id,
                  placeData.title,
                  placeData.description,
                  placeData.imageUrl,
                  placeData.price,
                  new Date(placeData.availableFrom),
                  new Date(placeData.availableTo),
                  placeData.userId
              );
            })
        );
  }

  fetchPlaces() {
    return this.http
        .get<{ [key: string]: PlaceData }>(this.API_URL + '/offered-places.json')
        .pipe(
            map(resData => {
              const places = [];
              for (const key in resData) {
                if (resData.hasOwnProperty(key)) {
                  places.push(
                      new Place(
                          key,
                          resData[key].title,
                          resData[key].description,
                          resData[key].imageUrl,
                          resData[key].price,
                          new Date(resData[key].availableFrom),
                          new Date(resData[key].availableTo),
                          resData[key].userId)
                  );
                }
              }

              return places;
            }),
            tap(places => {
              this._places.next(places);
            })
        );
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    let generatedId: string;
    const newPlace = new Place(
        Math.random().toString(),
        title,
        description,
        'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
        price,
        dateFrom,
        dateTo,
        this.authService.userId);

    return this.http
        .post<{name: string}>(this.API_URL + '/offered-places.json', { ...newPlace, id: null })
        .pipe(
            switchMap(resData => {
              generatedId = resData.name;
              return this.places;
            }),
            take(1),
            tap(places => {
              newPlace.id = generatedId;
              this._places.next(places.concat(newPlace));
            })
        );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
        take(1),
        switchMap(places => {
          if (!places || places.length <= 0) {
            return this.fetchPlaces();
          } else {
            return of(places);
          }
        }),
        switchMap(places => {
          const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
          updatedPlaces = [...places];
          const oldPlace = updatedPlaces[updatedPlaceIndex];
          updatedPlaces[updatedPlaceIndex] = new Place(
              oldPlace.id,
              title,
              description,
              oldPlace.imageUrl,
              oldPlace.price,
              oldPlace.availableFrom,
              oldPlace.availableTo,
              oldPlace.userId
          );

          return this.http.put(`${this.API_URL}/offered-places/${placeId}.json`,
              {...updatedPlaces[updatedPlaceIndex], id: null});
        }),
        tap(() => {
          this._places.next(updatedPlaces);
        })
    );
  }
}
