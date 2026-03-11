namespace DtOs.Track
{
    public class TrackDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Artist { get; set; }
        public string Album { get; set; }
        public int Duration { get; set; } // Duration in seconds
        public int Popularity { get; set; }
    }
}
