namespace DTOs
{
    public class TrackHistoryDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string CoverUrl { get; set; }
        public string Album { get; set; }
        public List<string> Artists { get; set; }
        public int Duration { get; set; }
        public bool Explicit { get; set; }
        public DateTime PlayedAt { get; set; }
    }
}
