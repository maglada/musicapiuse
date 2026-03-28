namespace SpotifyWebApp.Interfaces
{
    public class MusicBrainzResult
    {
        public List<string> Genres { get; set; } = new();
        public string? ReleaseDate { get; set; }
    }

    public interface IMusicBrainzService
    {
        Task<MusicBrainzResult> GetByIsrcAsync(string isrc);
    }
}
