import { TContactsForm } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class Contacts extends Form<TContactsForm> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._email = ensureElement<HTMLInputElement>(
			'.form__input[name=email]',
			container
		);
		this._phone = ensureElement<HTMLInputElement>(
			'.form__input[name=phone]',
			container
		);
	}

	private setFormValue(name: string, value: string): void {
		(this.container.elements.namedItem(name) as HTMLInputElement).value = value;
	}

	set email(value: string) {
		this.setFormValue('email', value);
	}

	set phone(value: string) {
		this.setFormValue('phone', value);
	}
}
