using SpotifyWebApp.Models;

namespace SpotifyWebApp.Interfaces
{
    public interface IMusicMetadataService
    {
        /// <param name="recordingId">MusicBrainz Recording GUID</param>
        Task<MusicMetadataResult> GetTechnicalDetailsAsync(string recordingId);
    }
}
