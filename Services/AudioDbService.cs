using System.Text.Json;
using SpotifyWebApp.Interfaces;

namespace SpotifyWebApp.Services
{
    public class AudioDbService : IAudioDbService
    {
        private readonly HttpClient _http;

        public AudioDbService(HttpClient http)
        {
            _http = http;
            _http.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0");
        }

        public async Task<AudioDbResult> GetAudioDbResultsAsync(string artist, string trackName)
        {
            var result = new AudioDbResult();

            var encodedArtist = Uri.EscapeDataString(artist);
            var encodedTrack = Uri.EscapeDataString(trackName);

            var url =
                $"https://www.theaudiodb.com/api/v1/json/2/searchtrack.php?s={encodedArtist}&t={encodedTrack}";

            try
            {
                var res = await _http.GetAsync(url);
                if (!res.IsSuccessStatusCode)
                    return result;

                var json = await res.Content.ReadAsStringAsync();

                using var searchDoc = JsonDocument.Parse(json);

                if (
                    searchDoc.RootElement.TryGetProperty("track", out var tracks)
                    && tracks.ValueKind == JsonValueKind.Array
                )
                {
                    if (tracks.GetArrayLength() > 0)
                    {
                        var track = tracks[0];
                        if (track.TryGetProperty("strMood", out var moodProp))
                        {
                            var mood = moodProp.GetString();
                            result.Mood =
                                (!string.IsNullOrEmpty(mood) && mood != "...")
                                    ? mood
                                    : "unprovided";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"AudioDb Error: {ex.Message}");
            }

            return result;
        }
    }
}
