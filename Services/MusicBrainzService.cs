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

            // Step 1 — ISRC lookup
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                $"https://musicbrainz.org/ws/2/isrc/{isrc}?fmt=json"
            );
            request.Headers.UserAgent.ParseAdd("BreakMusic/1.0 (vitaliioperrenko@gmail.com)");
            var res = await _http.SendAsync(request);
            if (!res.IsSuccessStatusCode)
                return result;
            var json = await res.Content.ReadAsStringAsync();

            // Step 2 — parse
            var searchDoc = JsonDocument.Parse(json);
            var recordings = searchDoc.RootElement.GetProperty("recordings");
            if (recordings.GetArrayLength() == 0)
                return result;
            var first = recordings[0];
            var recordingId = first.GetProperty("id").GetString();
            if (first.TryGetProperty("first-release-date", out var date))
                result.ReleaseDate = date.GetString();
            if (first.TryGetProperty("bpm", out var bpm))
                result.Bpm = bpm.GetInt32();
            if (first.TryGetProperty("key", out var key))
                result.Key = key.GetString() ?? "";

            // Step 3 — fetch genres from recording
            var request2 = new HttpRequestMessage(
                HttpMethod.Get,
                $"https://musicbrainz.org/ws/2/recording/{recordingId}?fmt=json&inc=tags+genres"
            );
            request2.Headers.UserAgent.ParseAdd("BreakMusic/1.0 (vitaliioperrenko@gmail.com)");
            var res2 = await _http.SendAsync(request2);
            if (!res2.IsSuccessStatusCode)
                return result;
            var json2 = await res2.Content.ReadAsStringAsync();
            var root = JsonDocument.Parse(json2).RootElement;

            if (root.TryGetProperty("genres", out var genres) && genres.GetArrayLength() > 0)
                result.Genres = genres
                    .EnumerateArray()
                    .OrderByDescending(g => g.GetProperty("count").GetInt32())
                    .Take(3)
                    .Select(g => g.GetProperty("name").GetString() ?? "")
                    .Where(s => s.Length > 0)
                    .ToList();
            else if (root.TryGetProperty("tags", out var tags) && tags.GetArrayLength() > 0)
                result.Genres = tags.EnumerateArray()
                    .OrderByDescending(t => t.GetProperty("count").GetInt32())
                    .Take(3)
                    .Select(t => t.GetProperty("name").GetString() ?? "")
                    .Where(s => s.Length > 0)
                    .ToList();

            return result;
        }
    }
}
