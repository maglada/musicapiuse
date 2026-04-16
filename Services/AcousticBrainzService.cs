using System.Text.Json;
using SpotifyWebApp.Interfaces;
using SpotifyWebApp.Models;

namespace SpotifyWebApp.Services
{
    public class AcousticBrainzService : IMusicMetadataService
    {
        private readonly HttpClient _http;

        public AcousticBrainzService(HttpClient http)
        {
            _http = http ?? throw new ArgumentNullException(nameof(http));

            if (!_http.DefaultRequestHeaders.Contains("User-Agent"))
            {
                _http.DefaultRequestHeaders.Add("User-Agent", "SpotifyWebApp/1.0");
            }
        }

        public async Task<MusicMetadataResult> GetTechnicalDetailsAsync(string recordingId)
        {
            var result = new MusicMetadataResult();

            if (string.IsNullOrEmpty(recordingId))
                return result;

            var url = $"https://acousticbrainz.org/api/v1/{recordingId}/low-level";

            try
            {
                var response = await _http.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                    return result;

                var json = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                var root = doc.RootElement;

                if (
                    root.TryGetProperty("rhythm", out var rhythm)
                    && rhythm.TryGetProperty("bpm", out var bpm)
                )
                {
                    result.Bpm = Math.Round(bpm.GetDouble(), 1);
                }

                if (root.TryGetProperty("tonal", out var tonal))
                {
                    if (tonal.TryGetProperty("key_key", out var k))
                        result.Key = k.GetString() ?? "Unknown";
                    if (tonal.TryGetProperty("key_scale", out var s))
                        result.Scale = s.GetString() ?? "Unknown";
                }

                result.Mood = result.Scale == "minor" ? "Somber" : "Bright";
            }
            catch { }

            return result;
        }
    }
}
