import { initContract } from "@ts-rest/core";
import { authContract } from "./auth.contract";
import { bibliothequeContract } from "./bibliotheque.contract";
import { statsContract } from "./stats.contract";
import { bookContract } from "./book.contract";
import { movieContract } from "./movie.contract";
import { movieInProgressContract } from "./movieInProgress.contract";
import { bookInProgressContract } from "./bookInProgress.contract";
import { filmothequeContract } from "./filmotheque.contract";
import { finishedBookContract } from "./finishedBook.contract";
import { friendlistContract } from "./friendlist.contract";
import { finishedMovieContract } from "./finishedMovie.contract";
import { userContract } from "./user.contract";

const contract = initContract();
export const biblioCineContract = contract.router({
  auth: authContract,
  bibliotheque: bibliothequeContract,
  filmotheque: filmothequeContract,
  stats: statsContract,
  books: bookContract,
  movies: movieContract,
  moviesInProgress: movieInProgressContract,
  booksInProgress: bookInProgressContract,
  finishedBook: finishedBookContract,
  finishedMovie: finishedMovieContract,
  friendlist: friendlistContract,
  user: userContract,
});
