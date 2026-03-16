using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using SpotifyAPI.Web;
using SpotifyWebApp.Interfaces;

namespace SpotifyWebApp.Services
{
    public class SpotifyService : ISpotifyService
    {
        private readonly SpotifyClient _spotify;
        private readonly SpotifyTokenService _tokenService;

        private SpotifyClient GetClient(string? userToken = null)
        {
            if (!string.IsNullOrEmpty(userToken))
                return new SpotifyClient(userToken);
            return _spotify;
        }

        public SpotifyService(IConfiguration config, SpotifyTokenService tokenService)
        {
            _tokenService = tokenService;
            var clientId = config["Spotify:ClientId"];
            var clientSecret = config["Spotify:ClientSecret"];

            var credentials = new ClientCredentialsRequest(clientId, clientSecret);
            var oauth = new OAuthClient();
            var token = oauth.RequestToken(credentials).Result;

            _spotify = new SpotifyClient(token.AccessToken);
        }

        public async Task<SearchResponse> GetSearchResultsAsync(string query, string type = "track")
        {
            switch (type.ToLower())
            {
                case "track":
                    var trackSearchRequest = new SearchRequest(SearchRequest.Types.Track, query);
                    return await _spotify.Search.Item(trackSearchRequest);
                case "album":
                    var albumSearchRequest = new SearchRequest(SearchRequest.Types.Album, query);
                    return await _spotify.Search.Item(albumSearchRequest);
                case "artist":
                    var artistSearchRequest = new SearchRequest(SearchRequest.Types.Artist, query);
                    return await _spotify.Search.Item(artistSearchRequest);
                default:
                    throw new ArgumentException(
                        "Invalid search type. Must be 'track', 'album', or 'artist'."
                    );
            }
        }

        public async Task<FullTrack> GetTrackAsync(string trackId)
        {
            var token = _tokenService.GetToken();
            Console.WriteLine($"SERVICE tokenService hash: {_tokenService.GetHashCode()}");
            Console.WriteLine($"TOKEN: {token?.Substring(0, 20) ?? "NULL"}");
            return await GetClient(token).Tracks.Get(trackId);
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
