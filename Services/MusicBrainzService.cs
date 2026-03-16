using System.Text.Json;
using SpotifyWebApp.Interfaces;

namespace SpotifyWebApp.Services
{
    public class MusicBrainzService : IMusicBrainzService
    {
        private readonly HttpClient _http;

        public MusicBrainzService(HttpClient http)
        {
            _http = http;
            _http.DefaultRequestHeaders.UserAgent.ParseAdd(
                "BreakMusic/1.0 (vitaliioperrenko@gmail.com)"
            );
        }

        public async Task<MusicBrainzResult> GetByIsrcAsync(string isrc)
        {
            var result = new MusicBrainzResult();

            var request = new HttpRequestMessage(
                HttpMethod.Get,
                $"https://musicbrainz.org/ws/2/isrc/{isrc}?fmt=json&inc=genres+tags"
            );
            request.Headers.UserAgent.ParseAdd("BreakMusic/1.0 (vitaliioperrenko@gmail.com)");

            var searchRes = await _http.SendAsync(request);

            if (!searchRes.IsSuccessStatusCode)
                return result;
            var searchJson = await searchRes.Content.ReadAsStringAsync();
            Console.WriteLine(
                $"MB ISRC response: {searchJson.Substring(0, Math.Min(500, searchJson.Length))}"
            );
            var searchDoc = JsonDocument.Parse(searchJson);
            var recordings = searchDoc.RootElement.GetProperty("recordings");
            if (recordings.GetArrayLength() == 0)
                return result;

            var first = recordings[0];
            var recordingId = first.GetProperty("id").GetString();

            // release date from search result
            if (first.TryGetProperty("releases", out var releases) && releases.GetArrayLength() > 0)
            {
                var release = releases[0];
                if (release.TryGetProperty("date", out var date))
                    result.ReleaseDate = date.GetString();
            }

            // Step 2 — fetch full recording with tags and genres
            var request2 = new HttpRequestMessage(
                HttpMethod.Get,
                $"https://musicbrainz.org/ws/2/recording/{recordingId}?fmt=json&inc=tags+genres"
            );
            request2.Headers.UserAgent.ParseAdd("BreakMusic/1.0 (vitaliioperrenko@gmail.com)");
            var recordingRes = await _http.SendAsync(request2);
            if (!recordingRes.IsSuccessStatusCode)
                return result;

            var recordingJson = await recordingRes.Content.ReadAsStringAsync();
            var recordingDoc = JsonDocument.Parse(recordingJson);
            var root = recordingDoc.RootElement;

            // try genres first, fall back to tags
            if (root.TryGetProperty("genres", out var genres) && genres.GetArrayLength() > 0)
            {
                result.Genres = genres
                    .EnumerateArray()
                    .OrderByDescending(g => g.GetProperty("count").GetInt32())
                    .Take(3)
                    .Select(g => g.GetProperty("name").GetString() ?? "")
                    .Where(s => s.Length > 0)
                    .ToList();
            }
            else if (root.TryGetProperty("tags", out var tags) && tags.GetArrayLength() > 0)
            {
                result.Genres = tags.EnumerateArray()
                    .OrderByDescending(t => t.GetProperty("count").GetInt32())
                    .Take(3)
                    .Select(t => t.GetProperty("name").GetString() ?? "")
                    .Where(s => s.Length > 0)
                    .ToList();
            }

            return result;
        }
    }
}
