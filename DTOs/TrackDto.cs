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
        public int Popularity { get; set; }
    }
}
