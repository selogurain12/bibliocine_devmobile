import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Bibliotheque } from "./bibliotheque/bibliotheque.entity";
import { BookInProgress } from "./bookInProgress/bookInProgress.entity";
import { Filmotheque } from "./filmotheque/filmotheque.entity";
import { FinishedBook } from "./finishedBook/finishedBook.entity";
import { FinishedMovie } from "./finishedMovie/finishedMovie.entity";
import { Friendlist } from "./friendlist/friendlist.entity";
import { MovieInProgress } from "./movieInProgress/movieInProgress.entity";
import { Stat } from "./stat/stat.entity";
import { User } from "./user/user.entity";
import { AuthentificationModule } from "./authentification/authentification.module";
import { BibliothequeModule } from "./bibliotheque/bibliotheque.module";
import { BookModule } from "./book/book.module";
import { BookInProgressModule } from "./bookInProgress/bookInProgress.module";
import { FilmothequeModule } from "./filmotheque/filmotheque.module";
import { FinishedBookModule } from "./finishedBook/finishedBook.module";
import { FinishedMovieModule } from "./finishedMovie/finishedMovie.module";
import { FriendlistModule } from "./friendlist/friendlist.module";
import { MovieModule } from "./movie/movie.module";
import { MovieInProgressModule } from "./movieInProgress/movieInProgress.module";
import { StatModule } from "./stat/stat.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot({
      entities: [
        Bibliotheque,
        BookInProgress,
        Filmotheque,
        FinishedBook,
        FinishedMovie,
        Friendlist,
        MovieInProgress,
        Stat,
        User,
      ],
      dbName: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.DBHOST,
      port: Number(process.env.PGPORT),
      debug: true,
      driver: PostgreSqlDriver,
      allowGlobalContext: true,
    }),
    AuthentificationModule,
    BibliothequeModule,
    BookModule,
    BookInProgressModule,
    FilmothequeModule,
    FinishedBookModule,
    FinishedMovieModule,
    FriendlistModule,
    MovieModule,
    MovieInProgressModule,
    StatModule,
    UserModule,
  ],
})
export class AppModule {}
