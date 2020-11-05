export interface PublicationResponse {
  publicationValues: Publications;
  publicationMetadata: Array<PublicationMetadata>;
}

export interface PublicationEditResponse {
  publicationInfo: Publication;
  publicationEditMetadata: Array<PublicationMetadata>;
}

export class Publications {
  pagingInfo: {};
  result: Array<Publication>;
}

export interface PublicationMetadata {
  id: number;
  name: string;
  type: string;
  fieldId: number;
  fieldCode: string;
  placeholderTxt: string;
  isReadOnly: boolean;
  isHidden: boolean;
  priority: number;
  isMandatory: boolean;
}

export class Publication {
  id: number;
  code: string;
  data: Array<PublicationData>;
}

export interface PublicationData {
  fieldId: number;
  value: string;
}
