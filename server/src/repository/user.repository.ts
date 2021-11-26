import { ICreateUserParams, IUserParams } from '../interafaces/user.interface';
import { User } from '../entity/user';

const field: (keyof User)[] = ['id', 'name', 'status', 'type', 'image', 'createdAt'];

export class UserRepository {
  async create(user: User) {
    return await User.save(user);
  }

  async getAll() {
    return await User.find({
      select: field,
    });
  }

  async findMainStoreAuth(params: IUserParams) {
    const query = await User.createQueryBuilder('u')
      .innerJoinAndSelect('u.storeId', 's')
      .where('s.type = :type', { type: params.type })
      .getRawOne();
    return query;
  }

  async findOne(params: IUserParams) {
    return await User.findOne({
      where: params,
      select: field,
    });
  }
}
