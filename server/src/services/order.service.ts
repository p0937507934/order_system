import { UpdateResult } from "typeorm";
import { Order } from "../entity/order";
import { IOrderCreateParams, IOrderDeleteParams } from "../interafaces/order.interface";
import { OrderRepository } from "../repository/order.repository";

export class ProductService {
    constructor(private readonly repository: OrderRepository) { }

    public async getAll(): Promise<Order[]> {
        const order = await this.repository.getAll();
        return order;
    }

    public async getById(id: number): Promise<Order | undefined> {
        const order = await this.repository.getById(id);
        return order;
    }

    public async getByStoreId(storeId: number): Promise<Order[]> {
        const order = await this.repository.getByStoreId(storeId);
        return order;
    }

    public async create(params: IOrderCreateParams): Promise<Order> {
        const order = new Order();
        Object.assign(order, params)
        return await this.repository.create(order);
    }

    public async delete(params:IOrderDeleteParams):Promise<UpdateResult | undefined>{
        const {id} = params;
        const order = await Order.findOne({id});
        if(order){
            order.status = 1;
            return await this.repository.update(order);
        }
    }
}