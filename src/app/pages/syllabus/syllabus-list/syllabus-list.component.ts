import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, of, Subscription } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { CommonService } from 'src/app/shared/services/common.service';
import { SyllabusService } from '../syllabus.service';

@Component({
  selector: 'app-syllabus-list',
  templateUrl: './syllabus-list.component.html',
  styleUrls: ['./syllabus-list.component.scss'],
})
export class SyllabusListComponent implements OnInit, OnDestroy {
  syllabusData: any;
  displayedColumns: string[] = [
    'sl',
    'syllabusName',
    'tradeName',
    'labelName',
    'uploadedSyllabus',
    'uploadedTestPlan',
    'developmentOfficer',
    'manager',
    'language',
    'activeDate',
    'actions',
  ];
  authSub: Subscription;
  deleteFIQuestionSub: Subscription;
  dataSource = new MatTableDataSource<any>();
  resultsLength = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private commonService: CommonService,
    private syllabusService: SyllabusService
  ) {}

  ngOnInit(): void {
    this.syllabusListGet();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  syllabusListGet = (): void => {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.syllabusService.syllabusList();
        }),
        map((data) => {
          this.resultsLength = data.length;
          return data;
        }),
        catchError(() => {
          return of([] as any);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.dataSource.data = data && data.length ? data : [];
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.syllabusData = data;
        } else {
          this.dataSource.data = [];
        }
      });
  };

  onDeleteConfirmation = (id: string): void => {
    this.commonService.showDialog(
      {
        title: 'You are going to delete a Syllabus',
        content: 'Are you sure?',
      },
      () => this.deleteSyllabus(id)
    );
  };

  deleteSyllabus = (id: string): void => {
    this.deleteFIQuestionSub = this.syllabusService
      .deleteSyllabus(id)
      .subscribe(
        (isDeleted: any) => {
          if (isDeleted) {
            this.commonService.showSuccessMsg('Syllabus has been deleted');
            this.syllabusListGet();
          } else {
            this.commonService.showErrorMsg('The syllabus is not deleted');
          }
        },
        (error: any) => {
          this.commonService.showErrorMsg('The PM Question is not deleted');
        }
      );
  };

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
    if (this.deleteFIQuestionSub) {
      this.deleteFIQuestionSub.unsubscribe();
    }
  }
}
