import { Api, ApiListResponse } from './base/api';
import { ICard } from '../types';
import { IOrder, IOrderResponse } from '../types';

interface ICardApi {
	getCards: () => Promise<ICard[]>;
	sendOrder: (data: IOrder) => Promise<IOrderResponse>;
}

export class LarekAPI extends Api implements ICardApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getCards(): Promise<ICard[]> {
		return this.get('/product').then((data: ApiListResponse<ICard>) => {
			return data.items.map((item) => ({
				...item,
				image: `${this.cdn}${item.image}`,
			}));
		});
	}

	sendOrder(data: IOrder): Promise<IOrderResponse> {
		return this.post('/order', data).then((data: IOrderResponse) => data);
	}
}
