import { MikroOrmModule } from "@mikro-orm/nestjs";
import { forwardRef, Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { Bibliotheque } from "./bibliotheque.entity";
import { BibliothequeController } from "./bibliotheque.controller";
import { BibliothequeService } from "./bibliotheque.service";
import { BibliothequeMapper } from "./bibliotheque.mapper";

@Module({
  imports: [MikroOrmModule.forFeature([Bibliotheque]), forwardRef(() => UserModule)],
  controllers: [BibliothequeController],
  providers: [BibliothequeService, BibliothequeMapper],
  exports: [BibliothequeService],
})
export class BibliothequeModule {}
