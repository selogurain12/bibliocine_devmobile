import { MikroOrmModule } from "@mikro-orm/nestjs";
import { forwardRef, Module } from "@nestjs/common";
import { BibliothequeModule } from "../bibliotheque/bibliotheque.module";
import { FilmothequeModule } from "../filmotheque/filmotheque.module";
import { FriendlistModule } from "../friendlist/friendlist.module";
import { User } from "./user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserMapper } from "./user.mapper";

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    forwardRef(() => FilmothequeModule),
    forwardRef(() => BibliothequeModule),
    forwardRef(() => FriendlistModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserMapper],
  exports: [UserService],
})
export class UserModule {}
