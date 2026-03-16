namespace DTOs
{
    public class ArtistDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string CoverUrl { get; set; }
        public List<string> Genres { get; set; }
        public int Popularity { get; set; }
    }
}
