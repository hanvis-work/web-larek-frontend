import { ICard, IBasketData } from '../types';
import { IEvents } from './base/events';

export class BasketData implements IBasketData {
	cards: string[] = [];
	protected events: IEvents;
  protected total: number = 0;

	constructor(events: IEvents) {
		this.events = events;
	}

	addCard(cardId: string): void {
    const isCardInBasket = this.cards.includes(cardId);
    if (!isCardInBasket) {
      this.cards.push(cardId);
      this.events.emit('basket:changed');
    }
  }

	deleteCard(cardId: string): void {
    this.cards = this.cards.filter((id) => id !== cardId);
    this.events.emit('basket:changed');
  }

	getCount(): number {
		return this.cards.length;
	}

	cardInBasket(cardId: string): boolean {
    return this.cards.includes(cardId);
  }

	clearBasket(): void {
		this.cards = [];
		this.events.emit('basket:changed');
	}

	getCardsId(): string[] {
    return this.cards;
  }

  calculateTotal(cards: ICard[]): void {
    this.total = this.cards.reduce((acc, cardId) => {
      const card = cards.find((card) => card.id === cardId);
      return acc + (card ? card.price : 0);
    }, 0);
  }

	getTotal(cards: ICard[]): number {
    this.calculateTotal(cards);
    return this.total;
  }
}