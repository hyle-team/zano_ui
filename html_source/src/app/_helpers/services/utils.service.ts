import {Injectable} from '@angular/core';

@Injectable()
export class UtilsService {
  getMinWidthByScale(scale: number) {
    switch (scale) {
      case 6  : return 900;
      case 8   : return 1200;
      case 10 : return 1500;
      case 12   : return 1800;
      default   : return 1200;
    }
  }
}
