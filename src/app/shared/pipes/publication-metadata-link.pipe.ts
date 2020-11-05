import { Pipe, PipeTransform } from '@angular/core';
import { Publication, PublicationData } from '../../modules/home/models/publication.model';

@Pipe({
  name: 'publicationMetadataLink'
})
export class PublicationMetadataLinkPipe implements PipeTransform {

  transform(value: Publication, fieldId: number): PublicationData {
    return value.data.find(v => v.fieldId === fieldId);
  }

}
