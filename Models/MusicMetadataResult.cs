namespace SpotifyWebApp.Models
{
    public class MusicMetadataResult
    {
        public double Bpm { get; set; }
        public string Key { get; set; } = "Unknown";
        public string Scale { get; set; } = "Unknown";
        public string Mood { get; set; } = "unprovided";

        public string FullKey => $"{Key} {Scale}";
    }
}
