using System.Threading.Tasks;
using SpotifyAPI.Web;

namespace SpotifyWebApp.Interfaces
{
    public interface ISpotifyService
    {
        Task<FullTrack> GetTrackAsync(string trackId);
        Task<FullAlbum> GetAlbumAsync(string albumId);
        Task<FullArtist> GetArtistAsync(string artistId);
        Task<SearchResponse> GetSearchResultsAsync(string query, string type = "track");
    }
}
