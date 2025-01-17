import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDatepicker, NgbDatepickerContent } from './datepicker';
import { NgbDatepickerMonth } from './datepicker';
import { NgbDatepickerNavigation } from './datepicker-navigation';
import { NgbInputDatepicker } from './datepicker-input';
import { NgbDatepickerDayView } from './datepicker-day-view';
import { NgbDatepickerNavigationSelect } from './datepicker-navigation-select';
import * as i0 from "@angular/core";
export { NgbDatepicker, NgbDatepickerContent } from './datepicker';
export { NgbInputDatepicker } from './datepicker-input';
export { NgbCalendar, NgbCalendarGregorian } from './ngb-calendar';
export { NgbCalendarIslamicCivil } from './hijri/ngb-calendar-islamic-civil';
export { NgbCalendarIslamicUmalqura } from './hijri/ngb-calendar-islamic-umalqura';
export { NgbCalendarPersian } from './jalali/ngb-calendar-persian';
export { NgbCalendarHebrew } from './hebrew/ngb-calendar-hebrew';
export { NgbDatepickerI18nHebrew } from './hebrew/datepicker-i18n-hebrew';
export { NgbCalendarBuddhist } from './buddhist/ngb-calendar-buddhist';
export { NgbDatepickerMonth } from './datepicker';
export { NgbDatepickerDayView } from './datepicker-day-view';
export { NgbDatepickerNavigation } from './datepicker-navigation';
export { NgbDatepickerNavigationSelect } from './datepicker-navigation-select';
export { NgbDatepickerConfig } from './datepicker-config';
export { NgbInputDatepickerConfig } from './datepicker-input-config';
export { NgbDatepickerI18n, NgbDatepickerI18nDefault } from './datepicker-i18n';
export { NgbDate } from './ngb-date';
export { NgbDateAdapter } from './adapters/ngb-date-adapter';
export { NgbDateNativeAdapter } from './adapters/ngb-date-native-adapter';
export { NgbDateNativeUTCAdapter } from './adapters/ngb-date-native-utc-adapter';
export { NgbDateParserFormatter } from './ngb-date-parser-formatter';
export { NgbDatepickerKeyboardService } from './datepicker-keyboard-service';
export class NgbDatepickerModule {
}
NgbDatepickerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbDatepickerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerModule, declarations: [NgbDatepicker, NgbDatepickerContent, NgbDatepickerMonth, NgbDatepickerNavigation, NgbDatepickerNavigationSelect,
        NgbDatepickerDayView, NgbInputDatepicker], imports: [CommonModule, FormsModule], exports: [NgbDatepicker, NgbDatepickerContent, NgbInputDatepicker, NgbDatepickerMonth] });
NgbDatepickerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerModule, imports: [[CommonModule, FormsModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        NgbDatepicker, NgbDatepickerContent, NgbDatepickerMonth, NgbDatepickerNavigation, NgbDatepickerNavigationSelect,
                        NgbDatepickerDayView, NgbInputDatepicker
                    ],
                    exports: [NgbDatepicker, NgbDatepickerContent, NgbInputDatepicker, NgbDatepickerMonth],
                    imports: [CommonModule, FormsModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZGF0ZXBpY2tlci9kYXRlcGlja2VyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxFQUFDLGFBQWEsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUNqRSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDaEQsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDaEUsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDdEQsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDM0QsT0FBTyxFQUFDLDZCQUE2QixFQUFDLE1BQU0sZ0NBQWdDLENBQUM7O0FBRTdFLE9BQU8sRUFBQyxhQUFhLEVBQUUsb0JBQW9CLEVBQWlELE1BQU0sY0FBYyxDQUFDO0FBQ2pILE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxXQUFXLEVBQWEsb0JBQW9CLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1RSxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUMzRSxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSx1Q0FBdUMsQ0FBQztBQUNqRixPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUNqRSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUMvRCxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUN4RSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUNyRSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDaEQsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDM0QsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDaEUsT0FBTyxFQUFDLDZCQUE2QixFQUFDLE1BQU0sZ0NBQWdDLENBQUM7QUFDN0UsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDeEQsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDbkUsT0FBTyxFQUFDLGlCQUFpQixFQUFFLHdCQUF3QixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFOUUsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sNkJBQTZCLENBQUM7QUFDM0QsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFDeEUsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sd0NBQXdDLENBQUM7QUFDL0UsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sNkJBQTZCLENBQUM7QUFDbkUsT0FBTyxFQUFDLDRCQUE0QixFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFVM0UsTUFBTSxPQUFPLG1CQUFtQjs7Z0hBQW5CLG1CQUFtQjtpSEFBbkIsbUJBQW1CLGlCQU41QixhQUFhLEVBQUUsb0JBQW9CLEVBQUUsa0JBQWtCLEVBQUUsdUJBQXVCLEVBQUUsNkJBQTZCO1FBQy9HLG9CQUFvQixFQUFFLGtCQUFrQixhQUdoQyxZQUFZLEVBQUUsV0FBVyxhQUR6QixhQUFhLEVBQUUsb0JBQW9CLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCO2lIQUcxRSxtQkFBbUIsWUFGckIsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDOzJGQUV6QixtQkFBbUI7a0JBUi9CLFFBQVE7bUJBQUM7b0JBQ1IsWUFBWSxFQUFFO3dCQUNaLGFBQWEsRUFBRSxvQkFBb0IsRUFBRSxrQkFBa0IsRUFBRSx1QkFBdUIsRUFBRSw2QkFBNkI7d0JBQy9HLG9CQUFvQixFQUFFLGtCQUFrQjtxQkFDekM7b0JBQ0QsT0FBTyxFQUFFLENBQUMsYUFBYSxFQUFFLG9CQUFvQixFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixDQUFDO29CQUN0RixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDO2lCQUNyQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0Zvcm1zTW9kdWxlfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge05nYkRhdGVwaWNrZXIsIE5nYkRhdGVwaWNrZXJDb250ZW50fSBmcm9tICcuL2RhdGVwaWNrZXInO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VyTW9udGh9IGZyb20gJy4vZGF0ZXBpY2tlcic7XG5pbXBvcnQge05nYkRhdGVwaWNrZXJOYXZpZ2F0aW9ufSBmcm9tICcuL2RhdGVwaWNrZXItbmF2aWdhdGlvbic7XG5pbXBvcnQge05nYklucHV0RGF0ZXBpY2tlcn0gZnJvbSAnLi9kYXRlcGlja2VyLWlucHV0JztcbmltcG9ydCB7TmdiRGF0ZXBpY2tlckRheVZpZXd9IGZyb20gJy4vZGF0ZXBpY2tlci1kYXktdmlldyc7XG5pbXBvcnQge05nYkRhdGVwaWNrZXJOYXZpZ2F0aW9uU2VsZWN0fSBmcm9tICcuL2RhdGVwaWNrZXItbmF2aWdhdGlvbi1zZWxlY3QnO1xuXG5leHBvcnQge05nYkRhdGVwaWNrZXIsIE5nYkRhdGVwaWNrZXJDb250ZW50LCBOZ2JEYXRlcGlja2VyTmF2aWdhdGVFdmVudCwgTmdiRGF0ZXBpY2tlclN0YXRlfSBmcm9tICcuL2RhdGVwaWNrZXInO1xuZXhwb3J0IHtOZ2JJbnB1dERhdGVwaWNrZXJ9IGZyb20gJy4vZGF0ZXBpY2tlci1pbnB1dCc7XG5leHBvcnQge05nYkNhbGVuZGFyLCBOZ2JQZXJpb2QsIE5nYkNhbGVuZGFyR3JlZ29yaWFufSBmcm9tICcuL25nYi1jYWxlbmRhcic7XG5leHBvcnQge05nYkNhbGVuZGFySXNsYW1pY0NpdmlsfSBmcm9tICcuL2hpanJpL25nYi1jYWxlbmRhci1pc2xhbWljLWNpdmlsJztcbmV4cG9ydCB7TmdiQ2FsZW5kYXJJc2xhbWljVW1hbHF1cmF9IGZyb20gJy4vaGlqcmkvbmdiLWNhbGVuZGFyLWlzbGFtaWMtdW1hbHF1cmEnO1xuZXhwb3J0IHtOZ2JDYWxlbmRhclBlcnNpYW59IGZyb20gJy4vamFsYWxpL25nYi1jYWxlbmRhci1wZXJzaWFuJztcbmV4cG9ydCB7TmdiQ2FsZW5kYXJIZWJyZXd9IGZyb20gJy4vaGVicmV3L25nYi1jYWxlbmRhci1oZWJyZXcnO1xuZXhwb3J0IHtOZ2JEYXRlcGlja2VySTE4bkhlYnJld30gZnJvbSAnLi9oZWJyZXcvZGF0ZXBpY2tlci1pMThuLWhlYnJldyc7XG5leHBvcnQge05nYkNhbGVuZGFyQnVkZGhpc3R9IGZyb20gJy4vYnVkZGhpc3QvbmdiLWNhbGVuZGFyLWJ1ZGRoaXN0JztcbmV4cG9ydCB7TmdiRGF0ZXBpY2tlck1vbnRofSBmcm9tICcuL2RhdGVwaWNrZXInO1xuZXhwb3J0IHtOZ2JEYXRlcGlja2VyRGF5Vmlld30gZnJvbSAnLi9kYXRlcGlja2VyLWRheS12aWV3JztcbmV4cG9ydCB7TmdiRGF0ZXBpY2tlck5hdmlnYXRpb259IGZyb20gJy4vZGF0ZXBpY2tlci1uYXZpZ2F0aW9uJztcbmV4cG9ydCB7TmdiRGF0ZXBpY2tlck5hdmlnYXRpb25TZWxlY3R9IGZyb20gJy4vZGF0ZXBpY2tlci1uYXZpZ2F0aW9uLXNlbGVjdCc7XG5leHBvcnQge05nYkRhdGVwaWNrZXJDb25maWd9IGZyb20gJy4vZGF0ZXBpY2tlci1jb25maWcnO1xuZXhwb3J0IHtOZ2JJbnB1dERhdGVwaWNrZXJDb25maWd9IGZyb20gJy4vZGF0ZXBpY2tlci1pbnB1dC1jb25maWcnO1xuZXhwb3J0IHtOZ2JEYXRlcGlja2VySTE4biwgTmdiRGF0ZXBpY2tlckkxOG5EZWZhdWx0fSBmcm9tICcuL2RhdGVwaWNrZXItaTE4bic7XG5leHBvcnQge05nYkRhdGVTdHJ1Y3R9IGZyb20gJy4vbmdiLWRhdGUtc3RydWN0JztcbmV4cG9ydCB7TmdiRGF0ZX0gZnJvbSAnLi9uZ2ItZGF0ZSc7XG5leHBvcnQge05nYkRhdGVBZGFwdGVyfSBmcm9tICcuL2FkYXB0ZXJzL25nYi1kYXRlLWFkYXB0ZXInO1xuZXhwb3J0IHtOZ2JEYXRlTmF0aXZlQWRhcHRlcn0gZnJvbSAnLi9hZGFwdGVycy9uZ2ItZGF0ZS1uYXRpdmUtYWRhcHRlcic7XG5leHBvcnQge05nYkRhdGVOYXRpdmVVVENBZGFwdGVyfSBmcm9tICcuL2FkYXB0ZXJzL25nYi1kYXRlLW5hdGl2ZS11dGMtYWRhcHRlcic7XG5leHBvcnQge05nYkRhdGVQYXJzZXJGb3JtYXR0ZXJ9IGZyb20gJy4vbmdiLWRhdGUtcGFyc2VyLWZvcm1hdHRlcic7XG5leHBvcnQge05nYkRhdGVwaWNrZXJLZXlib2FyZFNlcnZpY2V9IGZyb20gJy4vZGF0ZXBpY2tlci1rZXlib2FyZC1zZXJ2aWNlJztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTmdiRGF0ZXBpY2tlciwgTmdiRGF0ZXBpY2tlckNvbnRlbnQsIE5nYkRhdGVwaWNrZXJNb250aCwgTmdiRGF0ZXBpY2tlck5hdmlnYXRpb24sIE5nYkRhdGVwaWNrZXJOYXZpZ2F0aW9uU2VsZWN0LFxuICAgIE5nYkRhdGVwaWNrZXJEYXlWaWV3LCBOZ2JJbnB1dERhdGVwaWNrZXJcbiAgXSxcbiAgZXhwb3J0czogW05nYkRhdGVwaWNrZXIsIE5nYkRhdGVwaWNrZXJDb250ZW50LCBOZ2JJbnB1dERhdGVwaWNrZXIsIE5nYkRhdGVwaWNrZXJNb250aF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEZvcm1zTW9kdWxlXVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JEYXRlcGlja2VyTW9kdWxlIHtcbn1cbiJdfQ==