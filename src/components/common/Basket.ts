import { createElement, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IBasket {
	list: HTMLElement;
	total: HTMLElement;
	button: HTMLButtonElement;
}

export class Basket extends Component<IBasket> {
	protected events: IEvents;
	protected list: HTMLElement;
	protected totalPrice: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this.list = ensureElement<HTMLElement>('.basket__list', this.container);
		this.totalPrice = ensureElement<HTMLElement>('.basket__price', this.container);
		this.button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

		const initialTotal = 0;
		this.updateButtonState(initialTotal);

		this.button.addEventListener('click', () => {
			events.emit('order:open');
		});
	}

	set cards(cards: HTMLElement[]) {
		this.list.replaceChildren(...cards.length ? cards : [createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' })]);
	}

  protected updateButtonState(total: number): void {
    this.button.disabled = total === 0;
  }

	set total(total: number) {
		this.totalPrice.textContent = `${total} синапсов`;
		this.updateButtonState(total);
	}
}
