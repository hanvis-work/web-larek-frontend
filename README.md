# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Данные и типы данных, используемые в приложении

Карточка

```ts
interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  index: number;
}
```

Заказ

```ts
interface IOrder {
  items: string[];
  total: number;
  payment: string;
  address: string;
  email: string;
  phone: string;
}
```

Данные о товаре на главной странице

```ts
type TPreviewCard = Pick<ICard, 'category' | 'title' | 'image' | 'price'>;
```

Данные о товаре в модальном окне

```ts
type TModalCard = Pick<ICard, 'category' | 'title' | 'description' | 'image' | 'price'>;
```

Данные о товаре в корзинке

```ts
type TBasketCard = Pick<ICard, 'id' | 'title' | 'price'>;
```

Тип, описывающий форму заказа с полями для оплаты и адреса

```ts
type TOrderForm = Pick<IOrder, 'payment' | 'address'>;
```

Тип, описывающий форму контактов с полями для email и телефона

```ts
type TContactsForm = Pick<IOrder, 'email' | 'phone'>;
```

Тип, описывающий ошибки формы заказа.

```ts
type TFormErrors = Partial<Record<keyof IOrder, string>>;
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

#### Класс Component
Класс для создания компонентов пользовательского интерфейса. Предоставляет инструментарий для работы с DOM в дочерних компонентах. Наследуется всеми классами представления.

- `constructor(container: HTMLElement)` - конструктор принимает DOM-элемент в который помещается нужный компонент.

Методы:

- `toggleClass(element: HTMLElement, className: string)` - переключает класс переданного элемента
- `removeClass(element: HTMLElement, className: string)` - удаляет класс для переданного элемента
- `addClass(element: HTMLElement, className: string)` - добавляет класс для переданного элемента
- `setText(element: HTMLElement)` - устанавливает текстовое содержимое
- `setDisabled(element: HTMLElement, status: boolean)` - меняет статус блокировки
- `setHidden(element: HTMLElement)` - скрывает элемент
- `setVisible(element: HTMLElement)` - отображает элемент
- `setImage(element: HTMLImageElement)` - устанавливает изображение
- `render(): HTMLElement` - возвращает корневой DOM-элемент

### Слой данных

#### Класс CardsData

Класс отвечает за хранение и работу с данными карточек товаров.
Конструктор класса принимает инстант брокера событий.
В полях класса хранятся данные:

- `_cards: ICard[]` - Массив карточек
- `preview: ICard | null` - Карточка, выбранная для просмотра в модальном окне
- `events: IEvents` - Экземпляр класса `EventEmitter` для инициализации событий при изменении данных

Класс хранит набор методов для взаимодействия с его данными:

- `set cards(cards: ICard[])` - сеттер, задает массив карточек
- `get cards(): ICard[]` - геттер, возвращает массив карточек

#### Класс BasketData

Класс отвечает за хранение и работу с данными корзины товаров.
Конструктор класса принимает инстант брокера событий.
В полях класса хранятся данные:

- `cards: string[]` - Массив id карточек
- `events: IEvents` - Экземпляр класса `EventEmitter` для инициализации событий при изменении данных
- `total: number` - Общая сумма покупки

Класс хранит набор методов для взаимодействия с его данными:

- `addCard(card: ICard): void` - добавляет одну карточку в массив карточек
- `deleteCard(cardId: string): void` - удаляет одну карточку из массива карточек по id
- `getCount(): number` - возвращает количество карточек в корзине
- `cardInBasket(cardId: string): boolean` - проверяет наличие карточки в корзине по id
- `clearBasket(): void` - удаляет все карточки из корзины
- `getCardsId(): string[]` - возвращает массив id карточек
- `calculateTotal(cards: ICard[]): void` - считает общую стоимость
- `getTotal(): number` - возвращает общую стоимость всех карточек в корзине

#### Класс OrderData

Класс отвечает за хранение и работу с данными заказа.
Конструктор класса принимает инстант брокера событий.
В полях класса хранятся данные:

- `payment: string` - Строка, содержащая информацию о способе оплаты
- `address: string` - Строка, содержащая информацию о адресе доставки
- `email: string` - Строка, содержащая информацию о Email адресе покупателя
- `phone: string` - Строка, содержащая информацию о номере телефона покупателя
- `events: IEvents` - Экземпляр класса `EventEmitter` для инициализации событий при изменении данных
- `formErrors: TFormErrors` - Объект, содержащий информацию об ошибках в форме
- `button: boolean` - Флаг, указывающий на возможность отправки формы

Класс хранит набор методов для взаимодействия с его данными:

- `setPayment(value: string): void` - задает способ оплаты
- `setOrderInfo(orderData: TOrderForm): void` - задает информацию о заказе
- `setOrderField(field: keyof TOrderForm, value: string): void` - задает информацию о поле заказа
- `setContactsField(field: keyof TContactsForm, value: string): void` - устанавливает значение поля контактной информации
- `getOrderData(): TOrderForm & TContactsForm` - возвращает информацию о способе оплаты, адресе доставки и контактной информации
- `validatePayment(): boolean` - проверяет валидность способа оплаты
- `validateContacts(): boolean` - проверяет валидность контактной информации
- `updateFormErrors(errors: TFormErrors, event: string): void` - обновляет информацию об ошибках в форме
- `resetFormData(): void` - сбрасывает данные формы

### Классы представления

Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Card

Класс отвечает за отображение карточки товара в приложении. Используется в карточках каталога и корзине

- `constructor(container: HTMLElement, actions?: IActions)` - конструктор принимает DOM-элемент в который помещается нужная карточка и объект с обработчиками событий.

Поля класса:

- `cardId: string` - id карточки
- `cardImage: HTMLImageElement` - картинка карточки
- `cardCategory: HTMLElement` - категория карточки
- `cardTitle: HTMLElement` - название карточки
- `cardDescription: HTMLElement` - описание карточки
- `cardButton: HTMLButtonElement` - кнопка карточки
- `cardPrice: HTMLElement | null` - цена карточки
- `cardIndex: HTMLElement` - индекс карточки в корзине

Методы класса:

- `set index(value: number)` - устанавливает индекс карточки в корзине
- `set id(value: string)` - устанавливает id карточки
- `get id(): string` - возвращает id карточки
- `set image(value: string)` - устанавливает картинку карточки
- `set category(value: string)` - устанавливает категорию карточки
- `set title(value: string)` - устанавливает название карточки
- `set description(value: string)` - устанавливает описание карточки
- `set buttonText(value: string)` - устанавливает текст кнопки в корзине
- `set price(value: number)` - устанавливает цену карточки
- `setButtonState(state: boolean): void` - устанавливает состояние кнопки карточки
- `deleteHandler(handler: (event: MouseEvent) => void): void` - устанавливает обработчик события клика на кнопку удаления
- `clickHandler(handler: (event: MouseEvent) => void): void` - устанавливает обработчик события клика на кнопку карточки
- `getCardButton(): HTMLButtonElement` - возвращает кнопку карточки

#### Класс Page

Реализует главную странцу. По клику на кнопку корзины, генерирует событие `basket:open`

`constructor(container: HTMLElement, protected events: IEvents)` - конструктор принимает DOM-элемент в который помещается нужная страница и экземпляр класса `EventEmitter`

Поля класса:

- `_elements: Record<string, HTMLElement>` - объект с DOM-элементами

Методы класса:

- `set counter(value: number)` - устанавливает количество товаров в корзине
- `set catalog(items: HTMLElement[])` - устанавливает каталог товаров
- `set locked(value: boolean)` - устанавливает блокировку страницы при открытии модалки

#### Класс Modal

Реализует модальное окно. По клику, генерирует событие `modal:open` и при закрытии событие `modal:close`

`constructor(container: HTMLElement, protected events: IEvents)` - конструктор принимает DOM-элемент в который помещается нужное модальное окно и экземпляр класса `EventEmitter`

Поля класса:

- `_closeButton: HTMLButtonElement` - кнопка закрытия модального окна
- `_content: HTMLElement` - содержимое модального окна

Методы класса:

- `set content(value: HTMLElement)` - устанавливает содержимое модального окна
- `open(): void` - открывает модальное окно
- `close(): void` - закрывает модальное окно
- `render(data: IModalData): HTMLElement` - рендерит модальное окно с переданными данными

#### Класс Form

Предназначен для релизации общего элемента формы.

`constructor(protected container: HTMLFormElement, protected events: IEvents)` - конструктор принимает DOM-элемент в котором находится форма и экземпляр класса `EventEmitter`

Поля класса:

- `_submit: HTMLButtonElement` - кнопка отправки формы
- `_errors: HTMLElement` - элемент для вывода ошибок формы

Методы класса:
- `onInputChange(field: keyof T, value: string): void` - обработчик события изменения значения поля формы
- `set valid(value: boolean)` - устанавливает состояние валидности формы
- `set errors(value: string)` - устанавливает текст ошибок формы
- `render(state: Partial<T> & IFormState): HTMLElement` - рендерит форму с переданными данными
- `clear(): void` - очищает форму

#### Класс Basket

Предназначен для релизации корзины.

`constructor(container: HTMLElement, events: IEvents)` - конструктор принимает DOM-элемент в котором находится корзина и экземпляр класса `EventEmitter`

Поля класса:

- `events: IEvents` - экземпляр класса `EventEmitter` для инициализации событий при изменении данных
- `list: HTMLElement` - список товаров в корзине
- `totalPrice: HTMLElement` - сумма товаров в корзине
- `button: HTMLButtonElement` - кнопка оформления заказа

Методы класса:

- `set cards(cards: HTMLElement[])` - устанавливает список товаров в корзине
- `updateButtonState(total: number): void` - обновляет состояние кнопки оформления заказа
- `set total(total: number)` - устанавливает сумму товаров в корзине

#### Класс Order

Предназначен для релизации формы выбора метода оплаты и адреса доставки.

`constructor(container: HTMLFormElement, events: IEvents)` - конструктор принимает DOM-элемент в котором находится форма и экземпляр класса `EventEmitter`

Поля класса:
- `_online: HTMLButtonElement` - кнопка выбора онлайн оплаты
- `_offline: HTMLButtonElement` - кнопка выбора оффлайн оплаты
- `inputAddress: HTMLInputElement` - поле ввода адреса

Методы класса:
- `set payment(value: string)` - устанавливает способ оплаты
- `set address(value: string)` - устанавливает адрес доставки

#### Класс Contacts

Предназначен для релизации формы контактов.

`constructor(container: HTMLFormElement, events: IEvents)` - конструктор принимает DOM-элемент в котором находится форма и экземпляр класса `EventEmitter`

Поля класса:
- `_email: HTMLInputElement` - поле ввода Email
- `_phone: HTMLInputElement` - поле ввода номера телефона

Методы класса:
- `set email(value: string)` - устанавливает Email
- `set phone(value: string)` - устанавливает номер телефона

#### Класс Success

Предназначен для релизации окна успешного заказа.

`constructor(container: HTMLElement, actions: ISuccessActions)` - конструктор принимает DOM-элемент в котором находится окно и экземпляр класса `EventEmitter`

Поля класса:
- `_close: HTMLElement` - кнопка закрытия окна
- `_total: HTMLElement` - Итоговая сумма покупки

Методы класса:
- `set total(value: number)` - устанавливает итоговую сумму покупки

### Слой коммуникации

#### Класс LarekAPI

Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимоденйтвие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*

- `cards:changed` - событие, генерируемое при изменении списка карточек
- `card:select` - событие, генерируемое при выборе карточки

*События, возникающие при взаимодействии пользователя с интерфесом(генерируются классами, отвечающими за представление)*

- `card:select` - событие, генерируемое при выборе карточки (класс Card)
- `add:card` - событие, генерируемое при добавлении карточки в корзину (класс Card)
- `basket:open` - событие, генерируемое при открытии корзины (класс Basket)
- `delete:card` - событие, генерируемое при удалении карточки из корзины (класс Basket)
- `order:open` - событие, генерируемое при открытии формы заказа (класс Order)
- `order.payment:change` - событие, генерируемое при изменении способа оплаты (класс Order)
- `payment:changed` - событие, генерируемое при изменении платежной информации (класс Order)
- `formErrors:change` - событие, генерируемое при изменении ошибок формы (класс Form)
- `order:submit` - событие, генерируемое при отправке формы заказа (класс Order)
- `contacts:submit` - событие, генерируемое при отправке формы контактов (класс Contacts)
- `contacts.email:change` - событие, генерируемое при изменении Email
- `contacts.phone:change` - событие, генерируемое при изменении номера телефона
- `contactsErrors:change` - событие, генерируемое при изменении ошибок формы контактов

