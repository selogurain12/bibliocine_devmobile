import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { MovieInProgress } from "./movieInProgress.entity";
import { MovieInProgressController } from "./movieInProgress.controller";
import { MovieInProgressService } from "./movieInProgress.service";
import { MovieInProgressMapper } from "./movieInProgress.mapper";

@Module({
  imports: [MikroOrmModule.forFeature([MovieInProgress]), UserModule],
  controllers: [MovieInProgressController],
  providers: [MovieInProgressService, MovieInProgressMapper],
  exports: [MovieInProgressService],
})
export class MovieInProgressModule {}
