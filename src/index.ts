import './scss/styles.scss';
import { LarekAPI } from './components/LarekAPI';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { CardsData } from './components/CardsData';
import { BasketData } from './components/BasketData';
import { OrderData } from './components/OrderData';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ICard, TContactsForm, TFormErrors, TOrderForm } from './types';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const page = new Page(document.body, events);
const api = new LarekAPI(CDN_URL, API_URL);
const cardsData = new CardsData(events);
const basketData = new BasketData(events);
const orderData = new OrderData(events);

// Константы для шаблонов
const templates = {
	cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
	cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
	basket: ensureElement<HTMLTemplateElement>('#basket'),
	cardBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
	order: ensureElement<HTMLTemplateElement>('#order'),
	contacts: ensureElement<HTMLTemplateElement>('#contacts'),
	success: ensureElement<HTMLTemplateElement>('#success'),
	modalContainer: ensureElement<HTMLTemplateElement>('#modal-container'),
};

const modal = new Modal(templates.modalContainer, events);
const basket = new Basket(cloneTemplate(templates.basket), events);
const order = new Order(cloneTemplate(templates.order), events);
const contacts = new Contacts(cloneTemplate(templates.contacts), events);
const success = new Success(cloneTemplate(templates.success), {
	onClick: () => modal.close(),
});

// Мониторинг всех событий для отладки
events.onAll((event) => console.log(event.eventName, event.data));

// Выводим карточки на главную страницу
events.on('cards:changed', () => {
	page.catalog = cardsData.cards.map((card) => {
		const cardInstant = new Card(cloneTemplate(templates.cardCatalog), {
			onClick: () => events.emit('card:select', card),
		});

		Object.assign(cardInstant, {
			title: card.title,
			category: card.category,
			image: card.image,
			price: card.price,
		});

		return cardInstant.render();
	});
});

events.on('card:select', (card: ICard) => {
	const cardInModal = new Card(cloneTemplate(templates.cardPreview), {
		onClick: (event: MouseEvent) => {
      if (event.target === cardInModal.getCardButton()) {
        events.emit('add:card', card);
      }
    },
	});

	modal.render({
		content: cardInModal.render({
			title: card.title,
			category: card.category,
			image: card.image,
			price: card.price,
			description: card.description,
			id: card.id,
		}),
	});

	if (basketData.cardInBasket(card.id)) {
		cardInModal.setButtonState(true);
		cardInModal.buttonText = 'Добавлен';
	}
});

events.on('modal:open', () => (page.locked = true));
events.on('modal:close', () => (page.locked = false));

events.on('add:card', (card: ICard) => {
	basketData.addCard(card.id);
	modal.close();
});

events.on('basket:changed', () => {
	basket.cards = basketData.cards.map((item, index) => {
		const cardData = cardsData.cards.find((card) => card.id === item);
		const card = new Card(cloneTemplate(templates.cardBasket));
		card.index = index + 1;
		card.deleteHandler(() => events.emit('delete:card', cardData));
		return card.render(cardData);
	});
	page.counter = basketData.getCount();
	basket.total = basketData.getTotal(cardsData.cards);
});


events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

events.on('delete:card', (card: ICard) => basketData.deleteCard(card.id));

events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('order.payment:change', ({ value }: { value: string }) =>
	orderData.setPayment(value)
);
events.on('payment:changed', () => (order.payment = orderData.payment));

events.on('formErrors:change', (errors: Partial<TFormErrors>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address }).filter(Boolean).join('; ');
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof TOrderForm; value: string }) => {
		orderData.setOrderField(data.field, data.value);
		orderData.validatePayment();
	}
);

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('contactsErrors:change', (errors: Partial<TFormErrors>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email }).filter(Boolean).join('; ');
});

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof TContactsForm; value: string }) => {
		orderData.setContactsField(data.field, data.value);
		orderData.validateContacts();
	}
);

events.on('contacts:submit', () => {
	api
		.sendOrder({
			items: basketData.getCardsId(),
			total: basketData.getTotal(cardsData.cards),
			...orderData.getOrderData(),
		})
		.then(() => {
			modal.render({ content: success.render() });
			success.total = basketData.getTotal(cardsData.cards);
			basketData.clearBasket();
			orderData.resetFormData();
		})
		.catch(console.error);
});

// Получаем лоты с сервера
api
	.getCards()
	.then((cards) => (cardsData.cards = cards))
	.catch((err) => console.error(err));
