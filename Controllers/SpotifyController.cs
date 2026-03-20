using System;
using System.Threading.Tasks;
using DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SpotifyAPI.Web;
using SpotifyWebApp.Interfaces;
using SpotifyWebApp.Services;

namespace SpotifyWebApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SpotifyController : ControllerBase
    {
        private readonly ISpotifyService _spotifyService;
        private readonly IConfiguration _config;
        private readonly SpotifyTokenService _tokenService;
        private readonly IMusicBrainzService _musicBrainz;
        private readonly IAudioDbService _audioDb;

        public SpotifyController(
            ISpotifyService spotifyService,
            IConfiguration config,
            SpotifyTokenService tokenService,
            IMusicBrainzService musicBrainz,
            IAudioDbService audioDb
        )
        {
            _spotifyService = spotifyService;
            _config = config;
            _tokenService = tokenService;
            _musicBrainz = musicBrainz;
            _audioDb = audioDb;
        }

        [HttpGet("track/{id}")]
        public async Task<IActionResult> GetTrack(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("Track ID is required.");
            }
            try
            {
                var track = await _spotifyService.GetTrackAsync(id);
                var isrc = track.ExternalIds?.GetValueOrDefault("isrc");
                var mb =
                    isrc != null
                        ? await _musicBrainz.GetByIsrcAsync(isrc)
                        : new MusicBrainzResult();
                var ad = await _audioDb.GetAudioDbResultsAsync(id);
                var track_dto = new TrackDto
                {
                    Id = track.Id,
                    Title = track.Name,
                    CoverUrl = track.Album?.Images?.FirstOrDefault()?.Url,
                    Artists = track.Artists?.Select(a => a.Name).ToList(),
                    Album = track.Album?.Name,
                    Duration = track.DurationMs / 1000,
                    Explicit = track.Explicit,
                    Genres = mb.Genres,
                    ReleaseDate = mb.ReleaseDate,
                    Mood = ad.Mood,
                };
                return Ok(track_dto);
            }
            catch (Exception ex)
                when (ex.Message.Contains("404") || ex.Message.Contains("Not Found"))
            {
                return NotFound($"track '{id}' not found on Spotify.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Unexpected error: {ex.Message}");
            }
        }

        [HttpGet("artist/{id}")]
        public async Task<IActionResult> GetArtist(string id)
        {
            try
            {
                var artist = await _spotifyService.GetArtistAsync(id);
                var artist_dto = new ArtistDto
                {
                    Id = artist.Id,
                    Name = artist.Name,
                    CoverUrl = artist.Images?.FirstOrDefault()?.Url,
                    Genres = artist.Genres,
                    Popularity = artist.Popularity,
                };
                return Ok(artist_dto);
            }
            catch (Exception ex)
                when (ex.Message.Contains("404") || ex.Message.Contains("Not Found"))
            {
                return NotFound($"artist '{id}' not found on Spotify.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Unexpected error: {ex.Message}");
            }
        }

        [HttpGet("album/{id}")]
        public async Task<IActionResult> GetAlbum(string id)
        {
            try
            {
                var album = await _spotifyService.GetAlbumAsync(id);
                var genres = new List<string>();
                if (album.Artists?.Any() == true)
                {
                    var artist = await _spotifyService.GetArtistAsync(album.Artists.First().Id);
                    genres = artist.Genres ?? new List<string>();
                }
                var album_dto = new AlbumDto
                {
                    Id = album.Id,
                    Title = album.Name,
                    CoverUrl = album.Images?.FirstOrDefault()?.Url,
                    Artists = album.Artists?.Select(a => a.Name).ToList(),
                    Genres = genres,
                    ReleaseDate = album.ReleaseDate,
                    Popularity = album.Popularity,
                };
                return Ok(album_dto);
            }
            catch (Exception ex)
                when (ex.Message.Contains("404") || ex.Message.Contains("Not Found"))
            {
                return NotFound($"album '{id}' not found on Spotify.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Unexpected error: {ex.Message}");
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> GetSearchResultAsync(
            [FromQuery] string query,
            [FromQuery] string type = "track"
        )
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest($"Nothing to search for");
            }
            try
            {
                var results = await _spotifyService.GetSearchResultsAsync(query, type);
                var isEmpty = type.ToLower() switch
                {
                    "track" => results?.Tracks?.Items == null || results.Tracks.Items.Count == 0,
                    "album" => results?.Albums?.Items == null || results.Albums.Items.Count == 0,
                    "artist" => results?.Artists?.Items == null || results.Artists.Items.Count == 0,
                    _ => true,
                };
                if (isEmpty)
                {
                    return NotFound($"No results found for '{query}' with '{type}'");
                }
                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Unexpected error: {ex.Message}");
            }
        }

        //TODO-MAYBE: add ablity to filter underground(lower from 50/100 pop) and pop, enhancing it via recs for user or overall if not login

        [HttpGet("login")]
        public IActionResult Login()
        {
            var loginRequest = new LoginRequest(
                new Uri(_config["Spotify:RedirectUri"]),
                _config["Spotify:ClientId"],
                LoginRequest.ResponseType.Code
            )
            {
                Scope = new[]
                {
                    Scopes.UserReadPrivate,
                    Scopes.UserReadEmail,
                    Scopes.UserReadCurrentlyPlaying,
                },
            };

            return Redirect(loginRequest.ToUri().ToString());
        }

        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentPlaying()
        {
            var spotify = new SpotifyClient(_tokenService.GetToken());
            var current = await spotify.Player.GetCurrentlyPlaying(
                new PlayerCurrentlyPlayingRequest()
            );

            if (current.Item == null)
            {
                return NotFound("No track is currently playing.");
            }
            if (current.Item is FullTrack track)
            {
                var track_dto = new TrackDto
                {
                    Id = track.Id,
                    Title = track.Name,
                    CoverUrl = track.Album?.Images?.FirstOrDefault()?.Url,
                    Artists = track.Artists?.Select(a => a.Name).ToList(),
                    Album = track.Album?.Name,
                    Duration = track.DurationMs / 1000,
                    IsPlaying = current.IsPlaying,
                    ProgressMs = current.ProgressMs ?? 0,
                    Explicit = track.Explicit,
                };
                return Ok(track_dto);
            }
            return Ok(current);
        }

        [HttpGet("callback")]
        public async Task<IActionResult> Callback(string code)
        {
            var response = await new OAuthClient().RequestToken(
                new AuthorizationCodeTokenRequest(
                    _config["Spotify:ClientId"],
                    _config["Spotify:ClientSecret"],
                    code,
                    new Uri(_config["Spotify:RedirectUri"])
                )
            );
            Console.WriteLine(
                $"CALLBACK HIT, storing token: {response.AccessToken?.Substring(0, 20)}"
            );
            _tokenService.Store(response.AccessToken, response.RefreshToken);
            Console.WriteLine(
                $"TOKEN STORED, GetToken returns: {_tokenService.GetToken()?.Substring(0, 20)}"
            );

            return Redirect($"http://localhost:5173/?token={response.AccessToken}");
        }
    }
}
