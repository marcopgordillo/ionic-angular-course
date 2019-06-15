import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {

  private GOOGLE_API_KEY = environment.googleMapsAPIKey;

  @ViewChild('map')
  mapElementRef: ElementRef;

  clickListener: any;
  googleMaps: any;

  constructor(private modalCtrl: ModalController,
              private renderer: Renderer2) { }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.getGoogleMaps()
        .then(googleMaps => {
          this.googleMaps = googleMaps;
          const mapEl = this.mapElementRef.nativeElement;
          const map = new googleMaps.Map(mapEl, {
            center: { lat: 34.051670, lng: -84.176050 },
            zoom: 16
          });

          this.googleMaps.event.addListenerOnce(map, 'idle', () => {
            this.renderer.addClass(mapEl, 'visible');
          });

          this.clickListener = map.addListener('click', event => {
            const selectedCoords = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            };

            this.modalCtrl.dismiss(selectedCoords);
          });
        })
        .catch(err => {
          console.log(err);
        });
  }
  onCancel() {
    this.modalCtrl.dismiss();
  }

  private getGoogleMaps() {
    const win = window as any;
    const googleModule = win.google;

    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.GOOGLE_API_KEY}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google Maps SDK not available.');
        }
      };
    });
  }

  ngOnDestroy(): void {
    this.googleMaps.event.removeListener(this.clickListener);
  }

}
