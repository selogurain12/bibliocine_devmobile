import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { FinishedBook } from "./finishedBook.entity";
import { FinishedBookController } from "./finishedBook.controller";
import { FinishedBookService } from "./finishedBook.service";
import { FinishedBookMapper } from "./finishedBook.mapper";

@Module({
  imports: [MikroOrmModule.forFeature([FinishedBook]), UserModule],
  controllers: [FinishedBookController],
  providers: [FinishedBookService, FinishedBookMapper],
  exports: [FinishedBookService],
})
export class FinishedBookModule {}
