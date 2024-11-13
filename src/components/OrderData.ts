import { TFormErrors, IOrderData, TContactsForm, TOrderForm } from '../types';
import { IEvents } from './base/events';

export class OrderData implements IOrderData {
	payment: string;
	address: string;
	email: string;
	phone: string;
	protected events: IEvents;
	formErrors: TFormErrors = {};
	button: boolean = false;

	constructor(events: IEvents) {
		this.events = events;
	}

	setPayment(value: string): void {
		this.payment = value;
		this.events.emit('payment:changed');
	}

	setOrderInfo(orderData: TOrderForm): void {
		Object.assign(this, orderData);
	}

	setOrderField(field: keyof TOrderForm, value: string): void {
		this[field] = value;
	}

	setContactsField(field: keyof TContactsForm, value: string): void {
		this[field] = value;
	}

	getOrderData(): TOrderForm & TContactsForm {
		return {
			payment: this.payment,
			address: this.address,
			email: this.email,
			phone: this.phone,
		};
	}

	validatePayment(): boolean {
		const errors: TFormErrors = {};
		if (!this.payment) {
			errors.payment = 'Не выбран способ оплаты';
		}
		if (!this.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.updateFormErrors(errors, 'formErrors:change');
		return !Object.keys(errors).length;
	}

	validateContacts(): boolean {
		const errors: TFormErrors = {};
		if (!this.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.updateFormErrors(errors, 'contactsErrors:change');
		return !Object.keys(errors).length;
	}

	private updateFormErrors(errors: TFormErrors, event: string): void {
		this.formErrors = errors;
		this.events.emit(event, this.formErrors);
	}

	resetFormData(): void {
		Object.assign(this, {
			payment: '',
			address: '',
			email: '',
			phone: '',
			formErrors: {},
		});
	}
}
