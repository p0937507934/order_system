import { createConnection, getConnection, getConnectionManager } from 'typeorm';
import { User } from '../entity/user';
import { Store } from '../entity/store';
import { encrypt } from '../utils/md5';
import { Tag } from '../entity/tag';
import { Product } from '../entity/product';
const genData = async () => {
  const mode = process.env.MODE ? process.env.MODE : 'default';
  const productDeleteName = [];
  for (let i = 0; i < 32; i++) {
    productDeleteName.push("測資" + i.toString())
  }
  const defaultConnection = await createConnection(mode);
  await defaultConnection
    .createQueryBuilder()
    .delete()
    .from(User)
    .where('name=:name', { name: 'hsipl' })
    .execute();
  try {
    await defaultConnection.query("TRUNCATE TABLE product_tag");
  } catch (e) { console.log(e) }
  await defaultConnection
    .createQueryBuilder()
    .delete()
    .from(Tag)
    .where('tag=:tag', { tag: '胡椒粉' })
    .execute();
  await defaultConnection
    .createQueryBuilder()
    .delete()
    .from(Product)
    .where('name IN (:name)', { name: productDeleteName })
    .execute();

  await defaultConnection
    .createQueryBuilder()
    .delete()
    .from(Store)
    .where('name=:name', { name: 'kcy main store' })
    .execute();
  console.log('START CREATEING MAIN STORE...');

  const store = await defaultConnection
    .createQueryBuilder()
    .insert()
    .into('store')
    .values([
      {
        name: 'kcy main store',
        type: 1,
        status: 0,
        image: '',
      },
    ])
    .execute();
  console.log('CREATE MAIN STORE SUCCESS...');
  console.log('START CREATEING SUPERUSER...');

  await defaultConnection
    .createQueryBuilder()
    .insert()
    .into('user')
    .values([
      {
        username: 'hsipl206',
        password: encrypt('hsipl206'),
        name: 'hsipl',
        status: 0,
        type: 1,
        image: '',
        storeId: store.identifiers[0].id,
      },
    ])
    .execute();

  console.log('CREATE SUPER USER SUCCESS...');
  console.log('START CREATE TAG SUCCESS...');
  const tag = await defaultConnection
    .createQueryBuilder()
    .insert()
    .into('tag')
    .values([
      {
        tag: '胡椒粉',
        status: 0
      }
    ]).execute();
  console.log('CREATE TAG SUCCESS...');
  console.log('START PRODUCT TAG SUCCESS...');
  const productData = []
  for (let i = 0; i < 32; i++) {
    let product = new Product();
    product.name = "測資" + i.toString();
    product.price = 50;
    product.category = i % 4;
    product.storeId = store.identifiers[0].id;
    product.status = 0
    productData.push(product);
  }
  const product = await defaultConnection
    .createQueryBuilder()
    .insert()
    .into('product')
    .values(productData)
    .execute();
  console.log('CREATE PRODUCT SUCCESS...');
  let productIds = product.identifiers.map(a => a.id);
  let values = '';
  for (let i = 0; i < productIds.length; i++) {
    values += "(\'" + productIds[i] + "\',\'" + tag.identifiers[0].id + "\'),"
  }
  const quertString = "INSERT INTO product_tag (prodcut_id,tag_id) VALUES " + values.slice(0, -1);
  await defaultConnection.query(quertString)

  await defaultConnection.close();
};

genData();
