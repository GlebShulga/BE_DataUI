import { Migration } from "@mikro-orm/migrations";

export class Migration20230923052407 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "carts" alter column "id" type text using ("id"::text);'
    );
    this.addSql(
      'alter table "carts" alter column "user_id" type text using ("user_id"::text);'
    );

    this.addSql(
      'alter table "orders" alter column "id" type text using ("id"::text);'
    );
    this.addSql(
      'alter table "orders" alter column "user_id" type text using ("user_id"::text);'
    );
    this.addSql(
      'alter table "orders" alter column "cart_id" type text using ("cart_id"::text);'
    );

    this.addSql('alter table "carts" alter column "id" drop default;');
    this.addSql(
      'alter table "carts" alter column "id" type varchar(255) using ("id"::varchar(255));'
    );
    this.addSql(
      'alter table "carts" alter column "user_id" type varchar(255) using ("user_id"::varchar(255));'
    );
    this.addSql(
      'alter table "carts" alter column "is_deleted" type boolean using ("is_deleted"::boolean);'
    );
    this.addSql('alter table "carts" alter column "is_deleted" set not null;');

    this.addSql(
      'alter table "products" alter column "description" type varchar(255) using ("description"::varchar(255));'
    );
    this.addSql(
      'alter table "products" alter column "description" set not null;'
    );
    this.addSql(
      'alter table "products" alter column "price" type int using ("price"::int);'
    );

    this.addSql(
      'alter table "users" alter column "username" type varchar(255) using ("username"::varchar(255));'
    );
    this.addSql('alter table "users" alter column "username" set not null;');
    this.addSql(
      'alter table "users" alter column "email" type varchar(255) using ("email"::varchar(255));'
    );
    this.addSql('alter table "users" alter column "email" set not null;');

    this.addSql('alter table "orders" alter column "id" drop default;');
    this.addSql(
      'alter table "orders" alter column "id" type varchar(255) using ("id"::varchar(255));'
    );
    this.addSql(
      'alter table "orders" alter column "user_id" type varchar(255) using ("user_id"::varchar(255));'
    );
    this.addSql(
      'alter table "orders" alter column "cart_id" type varchar(255) using ("cart_id"::varchar(255));'
    );
    this.addSql(
      'alter table "orders" alter column "comments" type varchar(255) using ("comments"::varchar(255));'
    );
    this.addSql(
      'alter table "orders" alter column "total_price" type int using ("total_price"::int);'
    );
    this.addSql(
      'alter table "orders" add constraint "orders_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "orders" drop constraint "orders_user_id_foreign";'
    );

    this.addSql('alter table "users" drop constraint "users_cart_id_foreign";');

    this.addSql('alter table "carts" alter column "id" drop default;');
    this.addSql(
      'alter table "carts" alter column "id" type uuid using ("id"::text::uuid);'
    );
    this.addSql(
      'alter table "carts" alter column "id" set default uuid_generate_v4();'
    );
    this.addSql('alter table "carts" alter column "user_id" drop default;');
    this.addSql(
      'alter table "carts" alter column "user_id" type uuid using ("user_id"::text::uuid);'
    );
    this.addSql(
      'alter table "carts" alter column "is_deleted" type bool using ("is_deleted"::bool);'
    );
    this.addSql('alter table "carts" alter column "is_deleted" drop not null;');

    this.addSql('alter table "orders" alter column "id" drop default;');
    this.addSql(
      'alter table "orders" alter column "id" type uuid using ("id"::text::uuid);'
    );
    this.addSql(
      'alter table "orders" alter column "id" set default uuid_generate_v4();'
    );
    this.addSql('alter table "orders" alter column "user_id" drop default;');
    this.addSql(
      'alter table "orders" alter column "user_id" type uuid using ("user_id"::text::uuid);'
    );
    this.addSql('alter table "orders" alter column "cart_id" drop default;');
    this.addSql(
      'alter table "orders" alter column "cart_id" type uuid using ("cart_id"::text::uuid);'
    );
    this.addSql(
      'alter table "orders" alter column "comments" type text using ("comments"::text);'
    );
    this.addSql(
      'alter table "orders" alter column "total_price" type numeric using ("total_price"::numeric);'
    );

    this.addSql(
      'alter table "products" alter column "description" type varchar using ("description"::varchar);'
    );
    this.addSql(
      'alter table "products" alter column "description" drop not null;'
    );
    this.addSql(
      'alter table "products" alter column "price" type numeric using ("price"::numeric);'
    );

    this.addSql(
      'alter table "users" alter column "username" type varchar using ("username"::varchar);'
    );
    this.addSql('alter table "users" alter column "username" drop not null;');
    this.addSql(
      'alter table "users" alter column "email" type varchar using ("email"::varchar);'
    );
    this.addSql('alter table "users" alter column "email" drop not null;');
    this.addSql('alter table "users" drop constraint "users_cart_id_unique";');
    this.addSql('alter table "users" drop column "cart_id";');
  }
}
