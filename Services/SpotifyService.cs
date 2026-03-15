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
            return await _spotify.Tracks.Get(trackId);
        }

        public async Task<FullAlbum> GetAlbumAsync(string albumId)
        {
            return await _spotify.Albums.Get(albumId);
        }

        public async Task<FullArtist> GetArtistAsync(string artistId)
        {
            return await _spotify.Artists.Get(artistId);
        }
    }
}
