import { TOrderForm } from '../types';
import { ensureAllElements, ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export type TPaymentActions = {
	onClick: (event: MouseEvent) => void;
};

export class Order extends Form<TOrderForm> {
	protected _online: HTMLButtonElement;
	protected _offline: HTMLButtonElement;
	protected inputAddress: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._online = ensureElement<HTMLButtonElement>(
			'.button_alt[name="card"]',
			container
		);
		this._offline = ensureElement<HTMLButtonElement>(
			'.button_alt[name="cash"]',
			container
		);
		this.inputAddress = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			container
		);

		this._online.addEventListener('click', () => {
			this.onInputChange('payment', 'card');
		});
		this._offline.addEventListener('click', () => {
			this.onInputChange('payment', 'cash');
		});
	}

	set payment(value: string) {
		this.toggleClass(this._online, 'button_alt-active', value === 'card');
		this.toggleClass(this._offline, 'button_alt-active', value === 'cash');
	}

	set address(value: string) {
		this.inputAddress.value = value;
	}
}
