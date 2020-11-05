import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PublicationComponent} from './pages/publication/publication.component';
import {PublicationEditComponent} from './pages/publication-edit/publication-edit.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'publication',
    pathMatch: 'full',
  },
  {
    path: '',
    children: [
      {
        path: 'publication',
        component: PublicationComponent,
        children: [
          {
            path: ':id',
            component: PublicationEditComponent,
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
