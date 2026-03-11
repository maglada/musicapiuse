using System;
using System.Threading.Tasks;
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

        public SpotifyController(
            ISpotifyService spotifyService,
            IConfiguration config,
            SpotifyTokenService tokenService
        )
        {
            _spotifyService = spotifyService;
            _config = config;
            _tokenService = tokenService;
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
                return Ok(track);
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

        [HttpGet("album/{id}")]
        public async Task<IActionResult> GetAlbum(string id)
        {
            try
            {
                var album = await _spotifyService.GetAlbumAsync(id);
                return Ok(album);
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
            string type = "track"
        )
        {
            var request = new SearchRequest(SearchRequest.Types.Track, query) { };
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest($"Nothing to search for");
            }
            try
            {
                var results = await _spotifyService.GetSearchResultsAsync(query);
                if (results?.Tracks?.Items == null || results.Tracks.Items.Count == 0)
                {
                    return NotFound($"No results found for '{query}'");
                }
                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Unexpected error: {ex.Message}");
            }
        }

        //TODO: DTO for artist, album, track. ability to search and check in either way around.
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
                return Ok(track);
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
            _tokenService.Store(response.AccessToken, response.RefreshToken);

            return Redirect($"http://localhost:5173/?token={response.AccessToken}");
        }
    }
}
