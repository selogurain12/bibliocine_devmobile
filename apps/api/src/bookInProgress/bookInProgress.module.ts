import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { BookInProgress } from "./bookInProgress.entity";
import { BookInProgressController } from "./bookInProgress.controller";
import { BookInProgressService } from "./bookInProgress.service";
import { BookInProgressMapper } from "./bookInProgress.mapper";

@Module({
  imports: [MikroOrmModule.forFeature([BookInProgress]), UserModule],
  controllers: [BookInProgressController],
  providers: [BookInProgressService, BookInProgressMapper],
  exports: [BookInProgressService],
})
export class BookInProgressModule {}
