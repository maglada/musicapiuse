namespace DTOs
{
    public class AlbumDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string CoverUrl { get; set; }
        public List<string> Artists { get; set; }
        public string ReleaseDate { get; set; }
        public int Popularity { get; set; }
    }
}
