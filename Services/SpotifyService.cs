using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using SpotifyAPI.Web;
using SpotifyWebApp.Interfaces;

namespace SpotifyWebApp.Services
{
    public class SpotifyService : ISpotifyService
    {
        private readonly SpotifyClient _spotify;

        public SpotifyService(IConfiguration config)
        {
            var clientId = config["Spotify:ClientId"];
            var clientSecret = config["Spotify:ClientSecret"];

            var credentials = new ClientCredentialsRequest(clientId, clientSecret);
            var oauth = new OAuthClient();
            var token = oauth.RequestToken(credentials).Result;

            _spotify = new SpotifyClient(token.AccessToken);
        }

        public async Task<SearchResponse> GetSearchResultsAsync(string query, string type = "track")
        {
            var searchRequest = new SearchRequest(SearchRequest.Types.Track, query);
            return await _spotify.Search.Item(searchRequest);
        }

        public async Task<FullTrack> GetTrackAsync(string trackId)
        {
            return await _spotify.Tracks.Get(trackId);
        }

        public async Task<FullAlbum> GetAlbumAsync(string albumId)
        {
            return await _spotify.Albums.Get(albumId);
        }
    }
}
