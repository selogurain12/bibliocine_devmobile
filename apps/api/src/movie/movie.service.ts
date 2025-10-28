import axios from "axios";
import { Injectable } from "@nestjs/common";
import {
  ListResult,
  ReturnApiGenreDto,
  ReturnApiMovieDto,
  ReturnApiSearchMovieDto,
} from "@biblio-cine/source";
import { Movie } from "./movie.entity";

@Injectable()
export class MovieService {
  private readonly apiKey = "5dab12725eee000f48841e59fcf60567";
  private readonly baseUrl = "https://api.themoviedb.org/3";

  async getGenreList(id: number): Promise<ReturnApiGenreDto | null> {
    const apiUrl = `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=fr`;
    const response = await axios.get<{ genres: ReturnApiGenreDto[] }>(apiUrl);
    const genre = response.data.genres.find((g) => g.id === id);
    return genre ?? null;
  }

  async getDetailMovie(id: number) {
    const apiUrl = `${this.baseUrl}/movie/${id}?api_key=${this.apiKey}&language=fr-FR`;
    const response = await axios.get<ReturnApiMovieDto>(apiUrl);

    return {
      budget: response.data.budget,
      homepage: response.data.homepage,
      revenue: response.data.revenue,
      runtime: response.data.runtime,
      voteAverage: response.data.vote_average,
    };
  }

  async searchMovie(query: string): Promise<ListResult<Movie>> {
    const apiUrl = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(
      query
    )}&language=fr-FR`;
    const response = await axios.get<{ results: ReturnApiSearchMovieDto[] }>(apiUrl);

    const movies: Movie[] = await Promise.all(
      response.data.results.map(async (item) => {
        const movieDetails = await this.getDetailMovie(item.id);

        const genres = (
          await Promise.all(item.genre_ids.map((genreId) => this.getGenreList(genreId)))
        ).filter((genre): genre is ReturnApiGenreDto => genre !== null);

        return {
          id: item.id,
          title: item.title,
          backdropPath: item.backdrop_path,
          genreIds: genres.map((genre: ReturnApiGenreDto) => genre.name),
          originalLanguage: item.original_language,
          originalTitle: item.original_title,
          overview: item.overview,
          posterPath: item.poster_path,
          releaseDate: item.release_date,
          ...movieDetails,
        };
      })
    );

    return {
      data: movies,
      total: movies.length,
    };
  }

  async getMovie(id: number): Promise<Movie> {
    const apiUrl = `${this.baseUrl}/movie/${id}?api_key=${this.apiKey}&language=fr-FR`;
    const response = await axios.get<ReturnApiMovieDto>(apiUrl);

    const genres = (
      await Promise.all(response.data.genres.map((g) => this.getGenreList(g.id)))
    ).filter((g): g is ReturnApiGenreDto => g !== null);

    const movieDetails: Movie = {
      id: response.data.id,
      title: response.data.title,
      backdropPath: response.data.backdrop_path,
      genreIds: genres.map((genre: ReturnApiGenreDto) => genre.name),
      originalLanguage: response.data.original_language,
      originalTitle: response.data.original_title,
      overview: response.data.overview,
      posterPath: response.data.poster_path,
      releaseDate: response.data.release_date,
      budget: response.data.budget,
      homepage: response.data.homepage,
      revenue: response.data.revenue,
      runtime: response.data.runtime,
      voteAverage: response.data.vote_average,
    };

    return movieDetails;
  }
}
