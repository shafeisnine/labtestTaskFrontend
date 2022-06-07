import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { Subscription } from 'rxjs';
import { SyllabusService } from '../syllabus.service';

@Component({
  selector: 'app-syllabus-add',
  templateUrl: './syllabus-add.component.html',
  styleUrls: ['./syllabus-add.component.scss'],
})
export class SyllabusAddComponent implements OnInit, OnDestroy {
  id: string;
  formId = 'syllabusAddForm';
  form: FormGroup;
  tradeListSub: Subscription;
  syllabusDetailsSub: Subscription;
  labelListSub: Subscription;
  languageListSub: Subscription;
  updatesyllebusSub: Subscription;
  addsyllebusSub: Subscription;
  syllabusFileCheck: any;
  syllabusFile: any;
  testPlanFileCheck: any;
  testPlanFile: any;
  testPlanBase64: any;
  syllabusBase64: any;

  tradeData: any = [];
  syllabusDetailsData: any = [];
  labelData: any = [];
  languageData: any = [];
  selectedLanguage: any = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private syllabusService: SyllabusService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.form = this.fb.group({
      tradeId: ['', Validators.required],
      tradeName: ['', Validators.required],
      labelId: ['', Validators.required],
      labelName: ['', Validators.required],
      syllabusName: ['', Validators.required],
      uploadedSyllabus: ['', Validators.required],
      uploadedTestPlan: ['', Validators.required],
      developmentOfficer: ['', Validators.required],
      manager: ['', Validators.required],
      activeDate: ['', Validators.required],
    });
    this.getTradeList();
    this.getLanguageList();
  }

  get tradeId() {
    return this.form.get('tradeId');
  }
  get tradeName() {
    return this.form.get('tradeName');
  }
  get labelId() {
    return this.form.get('labelId');
  }
  get labelName() {
    return this.form.get('labelName');
  }

  get syllabusName() {
    return this.form.get('syllabusName');
  }

  get uploadedSyllabus() {
    return this.form.get('uploadedSyllabus');
  }
  get developmentOfficer() {
    return this.form.get('developmentOfficer');
  }
  get manager() {
    return this.form.get('manager');
  }
  get activeDate() {
    return this.form.get('activeDate');
  }

  onChangeLanguage(e: any, row: any) {
    if (e.checked) {
      this.selectedLanguage.push({
        languageName: row.languageName,
        shortName: row.shortName,
      });
    } else {
      this.selectedLanguage = this.selectedLanguage.filter(
        (item: any) => item.shortName !== row.shortName
      );
    }
  }

  getsyllabusdetails = (id: string) => {
    this.syllabusDetailsSub = this.syllabusService
      .detailSyllabus(id)
      .subscribe((data) => {
        if (data) {
          this.syllabusDetailsData = data.data;
          this.form.patchValue(this.syllabusDetailsData);
          this.getLabelList(this.syllabusDetailsData.tradeId);
          this.selectedLanguage = this.syllabusDetailsData.language;
          this.selectedLanguage.map((item: any) => {
            const index = this.languageData.findIndex(
              (i: any) => i.shortName === item.shortName
            );
            this.languageData[index].checked = true;
          });
        }
      });
  };
  getTradeList = () => {
    this.tradeListSub = this.syllabusService.tradeList().subscribe((data) => {
      if (data && data.length) {
        this.tradeData = data;
      }
    });
  };

  getLanguageList = () => {
    this.languageListSub = this.syllabusService
      .languageList()
      .subscribe((data) => {
        if (data && data.length) {
          this.languageData = data;
        }
        if (this.id) {
          this.getsyllabusdetails(this.id);
        }
      });
  };

  getLabelList = (tradeId: number) => {
    this.labelListSub = this.syllabusService
      .labelList(tradeId)
      .subscribe((data) => {
        this.labelData = data;
      });
  };

  onChangeTrade(tradeId: number) {
    const selectedTrade = this.tradeData.find(
      (cs: any) => cs.tradeId === tradeId
    );
    this.tradeName.patchValue(selectedTrade.tradeName);
    this.getLabelList(tradeId);
  }
  onChangeLabel(labelId: number) {
    const selectedLabel = this.labelData.find((cs: any) => cs._id === labelId);
    this.labelName.patchValue(selectedLabel.labelName);
  }

  onAddSyllabus(value: any) {
    if (this.id) {
      const syllabusUpdateData = {
        tradeId: value.tradeId,
        tradeName: value.tradeName,
        labelId: value.labelId,
        labelName: value.labelName,
        language: this.selectedLanguage,
        syllabusName: value.syllabusName,
        uploadedSyllabus: value.uploadedSyllabus,
        uploadedTestPlan: value.uploadedTestPlan,
        developmentOfficer: value.developmentOfficer,
        manager: value.manager,
        activeDate: value.activeDate,
        testPlanBase64: this.testPlanBase64,
        syllabusBase64: this.syllabusBase64,
      };

      this.updatesyllebusSub = this.syllabusService
        .updateSyllabus(this.id, syllabusUpdateData)
        .subscribe((isAdded) => {
          if (isAdded) {
            this.commonService.showSuccessMsg(
              'Syllabus has been added successfully'
            );

            this.router.navigate(['']);
          } else {
            this.commonService.showErrorMsg('Syllabus is not added');
          }
        });
    } else {
      const syllabusAddData = {
        tradeId: value.tradeId,
        tradeName: value.tradeName,
        labelId: value.labelId,
        labelName: value.labelName,
        language: this.selectedLanguage,
        syllabusName: value.syllabusName,
        uploadedSyllabus: value.uploadedSyllabus,
        uploadedTestPlan: value.uploadedTestPlan,
        developmentOfficer: value.developmentOfficer,
        manager: value.manager,
        activeDate: value.activeDate,
        testPlanBase64: this.testPlanBase64,
        syllabusBase64: this.syllabusBase64,
      };

      this.addsyllebusSub = this.syllabusService
        .addSyllabus(syllabusAddData)
        .subscribe((isAdded) => {
          if (isAdded) {
            this.commonService.showSuccessMsg(
              'Syllabus has been added successfully'
            );

            this.router.navigate(['']);
          } else {
            this.commonService.showErrorMsg('Syllabus is not added');
          }
        });
    }
  }

  testPlanFileUpload({ target }: Event): void {
    const files = (<HTMLInputElement>target).files;
    if (files && files.length > 0) {
      this.testPlanFileCheck = files[0];
      const fileExtension = this.testPlanFileCheck.name.replace(/^.*\./, '');

      if (fileExtension == 'pdf' || fileExtension! == 'doc') {
        this.testPlanFile = files[0];

        const reader = new FileReader();
        reader.readAsDataURL(this.testPlanFile);
        reader.onload = (event) => {
          this.testPlanBase64 = <string>event.target['result'];
        };
        this.form.patchValue({ uploadedTestPlan: this.testPlanFile.name });
      } else {
        alert('not an accepted file extension');
      }
    }
  }

  syllabusFileUpload({ target }: Event): void {
    const files = (<HTMLInputElement>target).files;
    if (files && files.length > 0) {
      this.syllabusFileCheck = files[0];
      const fileExtension = this.syllabusFileCheck.name.replace(/^.*\./, '');

      if (fileExtension == 'pdf' || fileExtension! == 'doc') {
        this.syllabusFile = files[0];

        const reader = new FileReader();
        reader.readAsDataURL(this.syllabusFile);
        reader.onload = (event) => {
          this.syllabusBase64 = <string>event.target['result'];
        };
        this.form.patchValue({ uploadedSyllabus: this.syllabusFile.name });
      } else {
        alert('not an accepted file extension');
      }
    }
  }

  ngOnDestroy(): void {
    if (this.tradeListSub) {
      this.tradeListSub.unsubscribe();
    }
    if (this.labelListSub) {
      this.labelListSub.unsubscribe();
    }
    if (this.addsyllebusSub) {
      this.addsyllebusSub.unsubscribe();
    }
    if (this.languageListSub) {
      this.languageListSub.unsubscribe();
    }
    if (this.syllabusDetailsSub) {
      this.syllabusDetailsSub.unsubscribe();
    }

    if (this.updatesyllebusSub) {
      this.updatesyllebusSub.unsubscribe();
    }
  }
}
