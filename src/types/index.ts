// Интерфейс описывающий данные о всех товарах, полученных с сервера
export interface ICardList {
	total: number;
	items: ICard[];
}

// Интерфейс описывающий данные товара
export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	index: number;
}

// Данные о товаре на главной странице
export type TPreviewCard = Pick<
	ICard,
	'category' | 'title' | 'image' | 'price'
>;

// Данные о товаре в модальном окне
export type TModalCard = Pick<
	ICard,
	'category' | 'title' | 'description' | 'image' | 'price'
>;

// Данные о товаре в корзинке
export type TBasketCard = Pick<ICard, 'id' | 'title' | 'price'>;

// Интерфейс описывающий данные о товарах
export interface ICardsData {
	cards: ICard[];
	preview: ICard | null;
}

// Интерфейс описывающий корзину товаров
export interface IBasketData {
	cards: ICard[];
	addCard(card: ICard): void;
	deleteCard(cardId: string): void;
	cardInBasket(cardId: string): boolean;
	clearBasket(): void;
	getCards(): ICard[];
	getCardsId(): string[];
	getTotal(): number;
}

// Интерфейс описывающий заказ
export interface IOrder {
	items: string[];
	total: number;
	payment: string;
	address: string;
	email: string;
	phone: string;
}

// Тип, описывающий форму заказа с полями для оплаты и адреса
export type TOrderForm = Pick<IOrder, 'payment' | 'address'>;

// Тип, описывающий форму контактов с полями для email и телефона
export type TContactsForm = Pick<IOrder, 'email' | 'phone'>;

// Тип, описывающий ошибки формы заказа
export type TFormErrors = Partial<Record<keyof IOrder, string>>;

// Интерфейс описывающий ответ на запрос о создании заказа
export interface IOrderResponse {
	id: string;
	total: number;
}

// Интерфейс описывающий данные о заказе
export interface IOrderData {
	payment: string;
	address: string;
	email: string;
	phone: string;
	setOrderInfo(orderData: TOrderForm): void;
	getOrderData(): TOrderForm & TContactsForm;
	validatePayment(): boolean;
	validateContacts(): boolean;
}
