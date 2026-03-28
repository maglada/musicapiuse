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
        }

        public async Task<AudioDbResult> GetAudioDbResultsAsync(string artist, string trackName)
        {
            var result = new AudioDbResult();

            var request = new HttpRequestMessage(
                HttpMethod.Get,
                $"https://www.theaudiodb.com/api/v1/json/2/searchtrack.php?s={artist}&t={trackName}"
            );
            var res = await _http.SendAsync(request);
            if (!res.IsSuccessStatusCode)
                return result;
            var json = await res.Content.ReadAsStringAsync();

            Console.WriteLine(json);
            var searchDoc = JsonDocument.Parse(json);
            if (
                !searchDoc.RootElement.TryGetProperty("track", out var tracks)
                || tracks.GetArrayLength() == 0
            )
                return result;
            var songMood = tracks[0].TryGetProperty("strMood", out var moodProp)
                ? moodProp.GetString() is var s && s != null && s != "..."
                    ? s
                    : "unprovided"
                : "unprovided";
            return result;
        }
    }
}
