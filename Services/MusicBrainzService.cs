using System.Text.Json;
using SpotifyWebApp.Interfaces;

namespace SpotifyWebApp.Services
{
    public class MusicBrainzService : IMusicBrainzService
    {
        private readonly HttpClient _http;
        private readonly IMusicMetadataService _metadataService;

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

            // Step 2 — parse із захистом!
            using var searchDoc = JsonDocument.Parse(json);

            // Перевіряємо, чи є взагалі властивість "recordings"
            if (
                !searchDoc.RootElement.TryGetProperty("recordings", out var recordings)
                || recordings.GetArrayLength() == 0
            )
            {
                return result; // Повертаємо пустий результат, якщо нічого не знайдено
            }

            var first = recordings[0];

            // Зберігаємо RecordingId, він нам потрібен для AcousticBrainz та для результату
            if (first.TryGetProperty("id", out var idProp))
            {
                result.RecordingId = idProp.GetString() ?? "";
            }

            if (string.IsNullOrEmpty(result.RecordingId))
                return result;

            if (first.TryGetProperty("first-release-date", out var date))
                result.ReleaseDate = date.GetString() ?? "Unknown";

            // Step 3 — Отримуємо технічні деталі (BPM/Key)
            // Додаємо перевірку, чи не null наш сервіс
            if (_metadataService != null)
            {
                var details = await _metadataService.GetTechnicalDetailsAsync(result.RecordingId);
                Console.WriteLine($"BPM: {details.Bpm}, Key: {details.FullKey}");
                // Можеш також додати технічні дані в result, якщо розшириш модель MusicBrainzResult
            }

            // Step 4 — Жанри та теги
            var request2 = new HttpRequestMessage(
                HttpMethod.Get,
                $"https://musicbrainz.org/ws/2/recording/{result.RecordingId}?fmt=json&inc=tags+genres"
            );
            request2.Headers.UserAgent.ParseAdd("BreakMusic/1.0 (vitaliioperrenko@gmail.com)");

            var res2 = await _http.SendAsync(request2);
            if (!res2.IsSuccessStatusCode)
                return result;

            var json2 = await res2.Content.ReadAsStringAsync();
            using var detailsDoc = JsonDocument.Parse(json2);
            var root = detailsDoc.RootElement;

            if (root.TryGetProperty("genres", out var genres) && genres.GetArrayLength() > 0)
            {
                result.Genres = genres
                    .EnumerateArray()
                    .Where(g =>
                        g.TryGetProperty("count", out var c) && g.TryGetProperty("name", out _)
                    )
                    .OrderByDescending(g => g.GetProperty("count").GetInt32())
                    .Take(3)
                    .Select(g => g.GetProperty("name").GetString() ?? "")
                    .Where(s => !string.IsNullOrEmpty(s))
                    .ToList();
            }
            else if (root.TryGetProperty("tags", out var tags) && tags.GetArrayLength() > 0)
            {
                result.Genres = tags.EnumerateArray()
                    .Where(t =>
                        t.TryGetProperty("count", out var c) && t.TryGetProperty("name", out _)
                    )
                    .OrderByDescending(t => t.GetProperty("count").GetInt32())
                    .Take(3)
                    .Select(t => t.GetProperty("name").GetString() ?? "")
                    .Where(s => !string.IsNullOrEmpty(s))
                    .ToList();
            }

            return result;
        }
    }
}
