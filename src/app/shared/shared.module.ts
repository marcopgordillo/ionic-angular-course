import {NgModule} from '@angular/core';
import {LocationPickerComponent} from './pickers/location-picker/location-picker.component';
import {MapModalComponent} from './map-modal/map-modal.component';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [LocationPickerComponent, MapModalComponent],
  imports: [CommonModule],
  exports: [LocationPickerComponent, MapModalComponent],
  entryComponents: [MapModalComponent]
})
export class SharedModule {
  
}
