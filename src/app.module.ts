import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/core/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import config from './config';
import { OrdersModule } from './orders/orders.module';
import { TagsModule } from './tags/tags.module';
import { ShoppingCartsModule } from './shopping-carts/shopping-carts.module';
import { AddressesModule } from './address/addresses.module';
import { CardsModule } from './cards/cards.module';
import { InvoicesModule } from './invoice/invoices.module';
import { ShippingModule } from './shipping/shipping.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      load: [config], 
    }),

    TypeOrmModule.forRootAsync({
      inject: [config.KEY], 
      useFactory: (configService: ConfigType<typeof config>) => ({
        type: 'postgres', 
        host: configService.database.host, 
        port: Number(configService.database.port),
        username: configService.database.username,
        password: configService.database.password,
        database: configService.database.name,
        autoLoadEntities: true, 
        synchronize: false, 
        migrationsRun: false, 
        logging: true, 
      }),
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule, 
    TagsModule, 
    ShoppingCartsModule, 
    AddressesModule,
    CardsModule, 
    InvoicesModule,
    ShippingModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'GLOBAL_PREFIX',
      useFactory: (configService: ConfigType<typeof config>) =>
        configService.app.globalPrefix,
      inject: [config.KEY],
    },
  ],
  exports: ['GLOBAL_PREFIX'],
})
export class AppModule {}