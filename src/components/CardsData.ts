import { ICardsData, ICard } from '../types';
import { IEvents } from './base/events';

export class CardsData implements ICardsData {
	protected _cards: ICard[];
	preview: ICard | null;
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