import { MikroOrmModule } from "@mikro-orm/nestjs";
import { forwardRef, Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { Filmotheque } from "./filmotheque.entity";
import { FilmothequeController } from "./filmotheque.controller";
import { FilmothequeService } from "./filmotheque.service";
import { FilmothequeMapper } from "./filmotheque.mapper";

@Module({
  imports: [MikroOrmModule.forFeature([Filmotheque]), forwardRef(() => UserModule)],
  controllers: [FilmothequeController],
  providers: [FilmothequeService, FilmothequeMapper],
  exports: [FilmothequeService],
})
export class FilmothequeModule {}
