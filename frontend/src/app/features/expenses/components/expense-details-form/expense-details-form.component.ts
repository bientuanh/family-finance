import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MonthlyPlanJar } from '../../../monthly-planning/models/budget-plan.models';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';

export type ExpenseFormField = 'expenseDate' | 'jarType' | 'amountVnd' | 'description';

@Component({
  selector: 'app-expense-details-form',
  imports: [ReactiveFormsModule, UiButtonComponent],
  templateUrl: './expense-details-form.component.html'
})
export class ExpenseDetailsFormComponent {
  readonly form = input.required<FormGroup>();
  readonly jars = input.required<MonthlyPlanJar[]>();
  readonly isLoadingPlan = input(false);
  readonly isSubmitting = input(false);
  readonly fieldErrors = input<Record<string, string>>({});
  readonly submitErrorMessage = input('');

  readonly expenseDateChanged = output<string>();
  readonly saveExpense = output<void>();

  onDateChanged(value: string): void {
    this.expenseDateChanged.emit(value);
  }

  onSubmit(): void {
    this.saveExpense.emit();
  }

  fieldError(fieldName: ExpenseFormField): string {
    return this.fieldErrors()[fieldName] ?? '';
  }
}
