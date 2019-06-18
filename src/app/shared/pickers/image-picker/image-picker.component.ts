import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {CameraResultType, CameraSource, Capacitor, Plugins} from '@capacitor/core';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  selectedImage: string;
  usePicker = false;

  @ViewChild('filePicker')
  filePickerRef: ElementRef<HTMLInputElement>;

  @Output()
  imagePick = new EventEmitter<string>();

  constructor(private platform: Platform) { }

  ngOnInit() {
    console.log('Mobile: ', this.platform.is('mobile'));
    console.log('Hybrid: ', this.platform.is('hybrid'));
    console.log('iOS: ', this.platform.is('ios'));
    console.log('Android: ', this.platform.is('android'));
    console.log('Desktop: ', this.platform.is('desktop'));
    
    if ((this.platform.is('mobile') && !this.platform.is('hybrid')) || this.platform.is('desktop')) {
      this.usePicker = true;
    }
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera') || this.usePicker) {
      this.filePickerRef.nativeElement.click();
      return;
    }

    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      // height: 320,
      width: 600,
      resultType: CameraResultType.Base64
    }).then(image => {
      this.selectedImage = image.base64String.replace(/^/, 'data:image/jpeg;base64,');
      this.imagePick.emit(image.base64String);
    }).catch(err => {
      console.log(err);
      return false;
    });
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }

    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
    };
    fr.readAsDataURL(pickedFile);
  }
}
