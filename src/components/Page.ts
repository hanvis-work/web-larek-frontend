import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _elements: Record<string, HTMLElement>;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._elements = {
			counter: ensureElement<HTMLElement>('.header__basket-counter'),
			catalog: ensureElement<HTMLElement>('.gallery'),
			wrapper: ensureElement<HTMLElement>('.page__wrapper'),
			basket: ensureElement<HTMLElement>('.header__basket'),
		};

		this._elements.basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set counter(value: number) {
		this.setText(this._elements.counter, String(value));
	}

	set catalog(items: HTMLElement[]) {
		this._elements.catalog.replaceChildren(...items);
	}

	set locked(value: boolean) {
		this.toggleClass(this._elements.wrapper, 'page__wrapper_locked', value);
	}
}
