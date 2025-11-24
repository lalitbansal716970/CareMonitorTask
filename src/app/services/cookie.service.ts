
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CookiesService {
  constructor(private cookieService: CookieService){

  }
  get(name: string): string | null {
    // const cookies = document.cookie.split(';');
    // for (let i = 0; i < cookies.length; i++) {
    //   let cookie = cookies[i].trim();
    //   if (cookie.startsWith(name + '=')) {
    //     return cookie.substring(name.length + 1);
    //   }
    // }

    // return null;

    return this.cookieService.get(name)
  }

  set(name: string, value: string, days: number = 7): void {
    // let expires = '';
    // if (days) {
    //   const date = new Date();
    //   date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    //   expires = '; expires=' + date.toUTCString();
    // }
    // document.cookie = name + '=' + (value || '') + expires + '; path=/';

     this.cookieService.set(name,value,days)

  }

  delete(name: string): void {
    document.cookie = name + '=; Max-Age=-99999999;';
  }
}
