import { FormControl, FormGroup } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';

import { ExpenseDetailsFormComponent } from '../../../../app/features/expenses/components/expense-details-form/expense-details-form.component';

describe('ExpenseDetailsFormComponent', () => {
  it('ExpenseDetailsForm_emitsDateAndSubmitActions', async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseDetailsFormComponent],
      providers: [provideRouter([])]
    }).compileComponents();
    const fixture = TestBed.createComponent(ExpenseDetailsFormComponent);
    fixture.componentRef.setInput(
      'form',
      new FormGroup({
        expenseDate: new FormControl('2025-03-01'),
        jarType: new FormControl('food'),
        amountVnd: new FormControl('50000'),
        description: new FormControl('Groceries')
      })
    );
    fixture.componentRef.setInput('jars', [{ jarType: 'food', name: 'Food', percentage: 20, budgetVnd: '5000000' }]);
    fixture.componentRef.setInput('fieldErrors', { description: 'Required' });
    const dateChanged = vi.fn();
    const saveExpense = vi.fn();
    fixture.componentInstance.expenseDateChanged.subscribe(dateChanged);
    fixture.componentInstance.saveExpense.subscribe(saveExpense);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('#expenseDate').value = '2025-03-02';
    fixture.nativeElement.querySelector('#expenseDate').dispatchEvent(new Event('change'));
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(dateChanged).toHaveBeenCalledWith('2025-03-02');
    expect(saveExpense).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.fieldError('description')).toBe('Required');
  });
});
