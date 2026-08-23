import {
  Injectable
} from '@angular/core';

import {
  NavigationEnd,
  Router
} from '@angular/router';

import {
  filter
} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ScrollTopService {


  constructor(
    private router: Router
  ) {

    this.router.events

      .pipe(

        filter(
          event =>
            event instanceof NavigationEnd
        )
      )

      .subscribe(() => {

        this.scrollToTop();
      });
  }


  private scrollToTop(): void {

    setTimeout(() => {

      window.scrollTo({

        top: 0,

        left: 0,

        behavior: 'instant'
      });


      document.documentElement.scrollTop =
        0;


      document.body.scrollTop =
        0;


      const scrollContainers =
        document.querySelectorAll(

          '.main-content, ' +
          '.dashboard-content, ' +
          '.page-content, ' +
          '.content-wrapper, ' +
          '.app-content, ' +
          '.router-content'
        );


      scrollContainers.forEach(

        container => {

          const element =
            container as HTMLElement;


          element.scrollTo({

            top: 0,

            left: 0,

            behavior: 'instant'
          });


          element.scrollTop =
            0;
        }
      );

    }, 0);
  }
}