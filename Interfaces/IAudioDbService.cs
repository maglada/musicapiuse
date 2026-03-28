namespace SpotifyWebApp.Interfaces
{
    public interface IAudioDbService
    {
        Task<AudioDbResult> GetAudioDbResultsAsync(string artist, string trackName);
    }
}
