import {
	ICardsData,
	ICard,
	IBasketData,
	TFormErrors,
	IOrderData,
	TContactsForm,
	TOrderForm,
} from '../types';
import { IEvents } from './base/events';

export class CardsData implements ICardsData {
	protected _cards: ICard[];
	preview: ICard;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set cards(cards: ICard[]) {
		this._cards = cards;
		this.events.emit('cards:changed');
	}

	get cards(): ICard[] {
		return this._cards;
	}
}

export class BasketData implements IBasketData {
	cards: ICard[] = [];
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	addCard(card: ICard): void {
		const isCardInBasket = this.cards.some((item) => item.id === card.id);
		if (!isCardInBasket) {
			this.cards.push(card);
			this.events.emit('basket:changed');
		}
	}

	deleteCard(cardId: string): void {
		this.cards = this.cards.filter((card) => card.id !== cardId);
		this.events.emit('basket:changed');
	}

	getCount(): number {
		return this.cards.length;
	}

	cardInBasket(cardId: string): boolean {
		return this.cards.some((card) => card.id === cardId);
	}

	clearBasket(): void {
		this.cards = [];
		this.events.emit('basket:changed');
	}

	getCards(): ICard[] {
		return this.cards;
	}

	getCardsId(): string[] {
		return this.cards.map((card) => card.id);
	}

	getTotal(): number {
		return this.cards.reduce((acc, card) => acc + card.price, 0);
	}
}

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
