import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { SyllabusAddComponent } from './syllabus-add/syllabus-add.component';
import { SyllabusListComponent } from './syllabus-list/syllabus-list.component';
import { ConfirmDialogueComponent } from './confirm-dialogue/confirm-dialogue.component';

export const routes = [
  { path: '', component: SyllabusListComponent, pathMatch: 'full' },
  { path: 'create', component: SyllabusAddComponent, pathMatch: 'full' },
  { path: 'edit/:id', component: SyllabusAddComponent, pathMatch: 'full' },
];

@NgModule({
  declarations: [SyllabusAddComponent, SyllabusListComponent, ConfirmDialogueComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
})
export class SyllabusModule {}
