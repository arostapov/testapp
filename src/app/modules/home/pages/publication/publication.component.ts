import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { PublicationService } from '../../services/publication.service';
import { take, takeUntil } from 'rxjs/operators';
import { Publication, PublicationMetadata, PublicationResponse, Publications } from '../../models/publication.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { EPublicationColumnType } from '../../enums/publication-type.enum';
import { Subject } from 'rxjs';
import { PublicationEditService } from '../../services/publication-edit.service';
import { MatTable } from '@angular/material/table';
import { SidenavService } from '../../services/sidenav.service';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.scss'],
})
export class PublicationComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  public publications: Array<Publication>;
  public publicationsMetadata: Array<PublicationMetadata>;

  public displayedColumns: Array<string>;
  public publicationColumnTypes = EPublicationColumnType;
  public isSidenavOpened: boolean;

  @ViewChild('sidenav') public sidenav: MatSidenav;
  @ViewChild(MatTable) public publicationsTable: MatTable<Publication>;
  constructor(private publicationService: PublicationService,
              private publicationEditService: PublicationEditService,
              private sidenavService: SidenavService,
              private route: ActivatedRoute,
              private cd: ChangeDetectorRef,
              private router: Router) { }

  ngOnInit(): void {
    this.publicationsMetadata = [];

    this.isSidenavOpened = this.sidenavService.opened;

    this.publicationService.getPublications()
      .pipe(take(1))
      .subscribe((res: PublicationResponse) => {
        this.publications = res.publicationValues.result;
        this.publicationsMetadata = res.publicationMetadata.sort((a, b) => a.priority - b.priority);
        this.publicationsMetadata = this.publicationsMetadata.filter(pm => pm.isHidden === false);
        this.displayedColumns = this.publicationsMetadata.map(item => item.name);
      });

    this.publicationEditService.editedPublication$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(publication => {
        if (Object.keys(publication).length > 0) {
          this.updateTable(publication);
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateTable(publication: Publication): void {
    const rawPublication = this.publications.find(p => +p.id === +publication.id);
    rawPublication.data.forEach((data) => {
      data.value = publication.data.find(p => p.fieldId === data.fieldId).value;
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    const tempPriority = this.publicationsMetadata[event.previousIndex].priority;
    this.publicationsMetadata[event.previousIndex].priority = this.publicationsMetadata[event.currentIndex].priority;
    this.publicationsMetadata[event.currentIndex].priority = tempPriority;

    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  editPublication(publication: Publication): void {
    this.sidenav.open();
    this.sidenavService.opened = true;
    this.router.navigate(['/home/publication', publication.id]);
  }

  sidenavClosed(): void {
    this.sidenavService.opened = false;
    this.router.navigate(['/home/publication']);
  }
}
