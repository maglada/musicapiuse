using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using SpotifyAPI.Web;
using SpotifyWebApp.Interfaces;

namespace SpotifyWebApp.Services
{
    public class SpotifyService : ISpotifyService
    {
        private readonly IConfiguration _config;
        private readonly SpotifyTokenService _tokenService;
        private SpotifyClient? _spotify;

        public SpotifyService(IConfiguration config, SpotifyTokenService tokenService)
        {
            _config = config;
            _tokenService = tokenService;
            // No network calls here anymore
        }

        private async Task<SpotifyClient> GetClientCredentialsClientAsync()
        {
            if (_spotify != null)
                return _spotify;

            var credentials = new ClientCredentialsRequest(
                _config["Spotify:ClientId"],
                _config["Spotify:ClientSecret"]
            );
            var token = await new OAuthClient().RequestToken(credentials);
            _spotify = new SpotifyClient(token.AccessToken);
            return _spotify;
        }

        private SpotifyClient GetClient(string? userToken = null)
        {
            if (!string.IsNullOrEmpty(userToken))
                return new SpotifyClient(userToken);
            if (_spotify == null)
                throw new InvalidOperationException(
                    "Client not initialized yet, call GetClientCredentialsClientAsync first"
                );
            return _spotify;
        }

        public async Task<SearchResponse> GetSearchResultsAsync(string query, string type = "track")
        {
            var client = await GetClientCredentialsClientAsync();
            var searchType = type.ToLower() switch
            {
                "track" => SearchRequest.Types.Track,
                "album" => SearchRequest.Types.Album,
                "artist" => SearchRequest.Types.Artist,
                _ => throw new ArgumentException("Invalid search type."),
            };
            return await client.Search.Item(new SearchRequest(searchType, query));
        }

        public async Task<FullTrack> GetTrackAsync(string trackId)
        {
            return await GetClient(_tokenService.GetToken()).Tracks.Get(trackId);
        }

        public async Task<FullAlbum> GetAlbumAsync(string albumId)
        {
            return await GetClient(_tokenService.GetToken()).Albums.Get(albumId);
        }

        public async Task<FullArtist> GetArtistAsync(string artistId)
        {
            return await GetClient(_tokenService.GetToken()).Artists.Get(artistId);
        }
    }
}
