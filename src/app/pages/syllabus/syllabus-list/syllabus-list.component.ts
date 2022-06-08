import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
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

  syllabusListSub : Subscription;
  deleteSyllabusSub: Subscription;
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

  syllabusListGet = () => {
    this.syllabusListSub = this.syllabusService
      .syllabusList()
      .subscribe((data) => {
        if (data && data.length) {
          this.dataSource.data = data && data.length ? data : [];
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.syllabusData = data;
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
    this.deleteSyllabusSub = this.syllabusService
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
    if (this.deleteSyllabusSub) {
      this.deleteSyllabusSub.unsubscribe();
    }
    if (this.syllabusListSub) {
      this.syllabusListSub.unsubscribe();
    }
  }
}
