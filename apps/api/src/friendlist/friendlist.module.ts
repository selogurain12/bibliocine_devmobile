import { MikroOrmModule } from "@mikro-orm/nestjs";
import { forwardRef, Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { Friendlist } from "./friendlist.entity";
import { FriendlistController } from "./friendlist.controller";
import { FriendlistService } from "./friendlist.service";
import { FriendlistMapper } from "./friendlist.mapper";

@Module({
  imports: [MikroOrmModule.forFeature([Friendlist]), forwardRef(() => UserModule)],
  controllers: [FriendlistController],
  providers: [FriendlistService, FriendlistMapper],
  exports: [FriendlistService],
})
export class FriendlistModule {}
