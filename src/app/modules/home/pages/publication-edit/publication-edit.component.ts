import { Component, OnDestroy, OnInit} from '@angular/core';
import { PublicationEditService } from '../../services/publication-edit.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Publication, PublicationMetadata } from '../../models/publication.model';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { EPublicationColumnType } from '../../enums/publication-type.enum';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_FORMATS } from '../../../../shared/helpers/datepicker.helper';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

@Component({
  selector: 'app-publication-edit',
  templateUrl: './publication-edit.component.html',
  styleUrls: ['./publication-edit.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class PublicationEditComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  public publicationEditForm: FormGroup;

  public publicationInfo: Publication;
  public publicationMetadata: Array<PublicationMetadata>;

  public publicationColumnTypes = EPublicationColumnType;
  public isDataSaved: boolean;
  constructor(private route: ActivatedRoute,
              private publicationEditService: PublicationEditService) { }

  ngOnInit(): void {
    this.isDataSaved = false;
    this.publicationEditForm = new FormGroup({});

    this.route.params
      .pipe(
        switchMap(params => {
          if (params?.id) {
            return this.publicationEditService.getPublicationEditInfo(params.id);
          }
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(res => {
        this.publicationInfo = JSON.parse(JSON.stringify(res.publicationInfo));
        this.publicationMetadata = res.publicationEditMetadata
                                      .filter(pm => pm.isHidden === false)
                                      .sort((a, b) => a.priority - b.priority);
        this.createPublicationFormGroup();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  createPublicationFormGroup(): void {
    this.publicationMetadata.forEach(pm => {
      const publicationValue = this.publicationInfo.data.find(p => p.fieldId === pm.fieldId).value;
      let formControl;
      if (pm.isMandatory) {
        formControl = new FormControl({
            value: publicationValue,
            disabled: pm.isReadOnly
          }, Validators.required);
      } else {
        formControl = new FormControl({
          value: publicationValue,
          disabled: pm.isReadOnly,
        });
      }
      this.publicationEditForm.addControl(pm.fieldCode, formControl);
    });
  }

  isFieldRequired(formControl: AbstractControl): boolean {
    return formControl.hasError('required');
  }

  saveResult(): void {
    Object.keys(this.publicationEditForm.value).map(fieldName => {
      const fieldId = this.publicationMetadata.find(pm => pm.fieldCode === fieldName).fieldId;
      this.publicationInfo.data.find(pi => pi.fieldId === fieldId).value = this.publicationEditForm.get(fieldName).value;
    });

    this.isDataSaved = true;
    this.publicationEditService.saveEditedPublication(this.publicationInfo);
  }

}
