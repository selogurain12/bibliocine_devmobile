import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { FinishedMovie } from "./finishedMovie.entity";
import { FinishedMovieController } from "./finishedMovie.controller";
import { FinishedMovieService } from "./finishedMovie.service";
import { FinishedMovieMapper } from "./finishedMovie.mapper";

@Module({
  imports: [MikroOrmModule.forFeature([FinishedMovie]), UserModule],
  controllers: [FinishedMovieController],
  providers: [FinishedMovieService, FinishedMovieMapper],
  exports: [FinishedMovieService],
})
export class FinishedMovieModule {}
