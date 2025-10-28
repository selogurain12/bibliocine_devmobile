import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { Stat } from "./stat.entity";
import { StatController } from "./stat.controller";
import { StatService } from "./stat.service";
import { StatMapper } from "./stat.mapper";

@Module({
  imports: [MikroOrmModule.forFeature([Stat]), UserModule],
  controllers: [StatController],
  providers: [StatService, StatMapper],
  exports: [StatService],
})
export class StatModule {}
