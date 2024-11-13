import { ICard } from '../types';
import { Component } from './base/Component';

interface IActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
	protected cardId: string;
	protected cardImage: HTMLImageElement;
	protected cardCategory: HTMLElement;
	protected cardTitle: HTMLElement;
	protected cardDescription: HTMLElement;
	protected cardButton: HTMLButtonElement;
	protected cardPrice: HTMLElement | null;
	protected cardIndex: HTMLElement;

	constructor(container: HTMLElement, actions?: IActions) {
		super(container);

		this.cardImage = container.querySelector('.card__image');
		this.cardCategory = container.querySelector('.card__category');
		this.cardTitle = container.querySelector('.card__title');
		this.cardDescription = container.querySelector('.card__text');
		this.cardButton = container.querySelector('.card__button');
		this.cardPrice = container.querySelector('.card__price');
		this.cardIndex = container.querySelector('.basket__item-index');

		if (actions && actions.onClick) {
			this.clickHandler(actions.onClick);
		}
	}

	set index(value: number) {
		this.setText(this.cardIndex, value);
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set image(value: string) {
		this.setImage(this.cardImage, value, this.title);
	}

	categoryColors: Map<string, string> = new Map([
		['софт-скил', 'card__category_soft'],
		['хард-скил', 'card__category_hard'],
		['дополнительное', 'card__category_additional'],
		['другое', 'card__category_other'],
		['кнопка', 'card__category_button'],
	]);

	set category(value: string) {
		this.setText(this.cardCategory, value);

		if (this.cardCategory) {
			this.removeClass(this.cardCategory, 'card__category_other');
			this.addClass(this.cardCategory, this.categoryColors.get(value));
		}
	}

	set title(value: string) {
		this.setText(this.cardTitle, value);
	}

	set description(value: string) {
		this.setText(this.cardDescription, value);
	}

	set buttonText(value: string) {
		this.setText(this.cardButton, value);
	}

	set price(value: number) {
		if (value === null || value === 0) {
			this.setText(this.cardPrice, 'Бесценно');
			this.setButtonState(true);
		} else {
			this.setText(this.cardPrice, `${value} синапсов`);
			this.setButtonState(false);
		}
	}

	setButtonState(state: boolean): void {
		if (this.cardButton) {
			this.cardButton.disabled = state;
		}
	}

	deleteHandler(handler: (event: MouseEvent) => void): void {
		const deleteButton = this.container.querySelector('.basket__item-delete');
		deleteButton?.addEventListener('click', handler);
	}

	clickHandler(handler: (event: MouseEvent) => void): void {
		this.container.addEventListener('click', handler);
	}
}
