namespace DTOs
{
    public class TrackDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string CoverUrl { get; set; }
        public List<string> Artists { get; set; }
        public string Album { get; set; }
        public int Duration { get; set; } // Duration in seconds
        public bool IsPlaying { get; set; }
        public int ProgressMs { get; set; }
        public bool Explicit { get; set; }
        public int Popularity { get; set; }
        public List<string> Genres { get; set; }
        public string ReleaseDate { get; set; }
        public int? Bpm { get; set; }
        public string Key { get; set; }
    }
}
