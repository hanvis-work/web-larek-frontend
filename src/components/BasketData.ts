import { ICard, IBasketData } from '../types';
import { IEvents } from './base/events';
import { CardsData } from './CardsData';

export class BasketData implements IBasketData {
	cards: string[] = [];
  private cardsData: CardsData;
	protected events: IEvents;
  protected total: number = 0;

	constructor(events: IEvents, cardsData: CardsData) {
		this.events = events;
    this.cardsData = cardsData;
	}

	addCard(cardId: string): void {
    const isCardInBasket = this.cards.includes(cardId);
    if (!isCardInBasket) {
      this.cards.push(cardId);
      this.calculateTotal();
      this.events.emit('basket:changed');
    }
  }

	deleteCard(cardId: string): void {
    this.cards = this.cards.filter((id) => id !== cardId);
    this.calculateTotal();
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

	getCards(): ICard[] {
    return this.cards.map((cardId) => {
      const card = this.cardsData.cards.find((card) => card.id === cardId);
      return card;
    });
  }

	getCardsId(): string[] {
    return this.cards;
  }

  calculateTotal(): void {
    this.total = this.cards.reduce((acc, cardId) => {
      const card = this.cardsData.cards.find((card) => card.id === cardId);
      return acc + (card ? card.price : 0);
    }, 0);
  }

	getTotal(): number {
    return this.total;
  }
}