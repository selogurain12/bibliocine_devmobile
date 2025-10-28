/* eslint-disable max-params */
import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { FinishedBookService } from "src/finishedBook/finishedBook.service";
import { FinishedMovieService } from "src/finishedMovie/finishedMovie.service";
import { BookInProgressService } from "src/bookInProgress/bookInProgress.service";
import { MovieInProgressService } from "src/movieInProgress/movieInProgress.service";
import {
  AllStatDto,
  CreateStatDto,
  StatDto,
  statsContract,
  UpdateStatDto,
} from "@biblio-cine/source";
import { MikroORM } from "@mikro-orm/postgresql";
import { TsRestException } from "@ts-rest/nest";
import { BibliothequeService } from "../bibliotheque/bibliotheque.service";
import { FilmothequeService } from "../filmotheque/filmotheque.service";
import { StatMapper } from "./stat.mapper";
import { Stat } from "./stat.entity";

@Injectable()
export class StatService {
  private readonly orm: MikroORM;

  private readonly statMapper: StatMapper;

  private readonly filmothequeService: FilmothequeService;

  private readonly bibliothequeService: BibliothequeService;

  private readonly finishedBookService: FinishedBookService;

  private readonly finishedMovieService: FinishedMovieService;

  private readonly bookInProgressService: BookInProgressService;

  private readonly movieInProgressService: MovieInProgressService;
  constructor(
    orm: MikroORM,
    statMapper: StatMapper,
    filmothequeService: FilmothequeService,
    bibliothequeService: BibliothequeService,
    finishedBookService: FinishedBookService,
    finishedMovieService: FinishedMovieService,
    bookInProgressService: BookInProgressService,
    movieInProgressService: MovieInProgressService
  ) {
    this.orm = orm;
    this.statMapper = statMapper;
    this.filmothequeService = filmothequeService;
    this.bibliothequeService = bibliothequeService;
    this.finishedBookService = finishedBookService;
    this.finishedMovieService = finishedMovieService;
    this.bookInProgressService = bookInProgressService;
    this.movieInProgressService = movieInProgressService;
  }

  async create(userId: string, createStatDto: CreateStatDto): Promise<StatDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(Stat);
      const existingStat = await repository.findOne({ id: userId });
      if (!existingStat) {
        throw new ConflictException("This user have already stats");
      }
      const item = await this.statMapper.createDtoToEntity(createStatDto, userId, em);
      await em.persistAndFlush(item);
      await em.commit();
      await em.populate(item, ["user"]);
      return await this.statMapper.entityToDto(item, userId, em);
    } catch (error) {
      await em.rollback();

      const message =
        error instanceof Error ? error.message || "Stat creation failed" : "Stat creation failed";
      throw new InternalServerErrorException(message);
    }
  }

  async simpleStat(userId: string): Promise<StatDto> {
    const em = this.orm.em.fork();
    const repository = em.getRepository(Stat);
    const existingStat = await repository.findOne({ user: { id: userId } });
    if (!existingStat) {
      throw new TsRestException(statsContract.simpleStats, {
        status: 404,

        body: {
          error: "StatNotFound",
          message: `Stat with userId ${userId} not found`,
        },
      });
    }
    return await this.statMapper.entityToDto(existingStat, userId, em);
  }

  async stats(userId: string): Promise<AllStatDto> {
    const em = this.orm.em.fork();
    const repository = em.getRepository(Stat);
    const existingStat = await repository.findOne({ user: { id: userId } }, { populate: ["user"] });
    if (!existingStat) {
      throw new TsRestException(statsContract.simpleStats, {
        status: 404,

        body: {
          error: "StatNotFound",
          message: `Stat with userId ${userId} not found`,
        },
      });
    }
    const filmotheque = await this.filmothequeService.getAll(userId);
    const bibliotheque = await this.bibliothequeService.getAll(userId);
    const finishedMovie = await this.finishedMovieService.getAll(userId);
    const finishedBook = await this.finishedBookService.getAll(userId);
    const movieInProgress = await this.movieInProgressService.getAll(userId);
    const bookInProgress = await this.bookInProgressService.getAll(userId);
    return {
      id: existingStat.id,
      timeSeen: existingStat.timeSeen,
      pagesRead: existingStat.pagesRead,
      filmotheque: filmotheque.total,
      finishedMovies: finishedMovie.total,
      moviesInProgress: movieInProgress.total,
      finishedBooks: finishedBook.total,
      booksInProgress: bookInProgress.total,
      bibliotheque: bibliotheque.total,
    };
  }

  async update(id: string, userId: string, updateStatDto: UpdateStatDto): Promise<StatDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(Stat);
      const existingEntity = await repository.findOne({
        id,
        user: { id: userId },
      });
      if (!existingEntity) {
        throw new TsRestException(statsContract.updateStats, {
          status: 404,
          body: {
            error: "StatsNotFound",
            message: `Stats with id ${id} not found`,
          },
        });
      }
      const item = await this.statMapper.updateDtoToEntity(id, updateStatDto, userId, em);
      await em.persistAndFlush(item);
      await em.commit();
      await em.populate(item, ["user"]);
      return await this.statMapper.entityToDto(item, userId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(statsContract.updateStats, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "Stat update failed",
            },
          })
        : new TsRestException(statsContract.updateStats, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "Stat update failed",
            },
          });
    }
  }

  public async delete(id: string, userId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(Stat);
      const entity = await repository.findOne({
        $and: [{ id }, { user: { id: userId } }],
      });
      if (!entity) {
        throw new NotFoundException(`Stats with id ${id} not found`);
      }
      await em.removeAndFlush(entity);
      await em.commit();
    } catch (error) {
      await em.rollback();

      const message =
        error instanceof Error ? error.message || "Stat delete failed" : "Stat delete failed";
      throw new InternalServerErrorException(message);
    }
  }
}
