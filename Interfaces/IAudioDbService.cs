namespace SpotifyWebApp.Interfaces
{
    public class AudioDbResult
    {
        public string strMood { get; set; } = "";
    }

    public interface AudioDbResultService
    {
        Task<AudioDbResult> GetAudioDbResultAsync(string query);
    }
}
