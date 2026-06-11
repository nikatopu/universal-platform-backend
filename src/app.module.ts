import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { PrismaModule } from "./database/prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { CompaniesModule } from "./modules/companies/companies.module";
import { ProfessionalsModule } from "./modules/professionals/professionals.module";
import { ProgramsModule } from "./modules/programs/programs.module";
import { MembershipsModule } from "./modules/memberships/memberships.module";
import { ClassesModule } from "./modules/classes/classes.module";
import { BookingsModule } from "./modules/bookings/bookings.module";
import { SettingsModule } from "./modules/settings/settings.module";
import appConfig from "./config/app.config";
import jwtConfig from "./config/jwt.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig],
      envFilePath: ".env",
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    ProfessionalsModule,
    ProgramsModule,
    MembershipsModule,
    ClassesModule,
    BookingsModule,
    SettingsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
