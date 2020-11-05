import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicationMetadataLinkPipe } from './pipes/publication-metadata-link.pipe';



@NgModule({
  declarations: [
    PublicationMetadataLinkPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PublicationMetadataLinkPipe
  ],
})
export class SharedModule { }
