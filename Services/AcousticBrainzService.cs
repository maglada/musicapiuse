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

            try
            {
                var url = $"https://acousticbrainz.org/api/v1/{recordingId}/low-level";
                var response = await _http.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                    return result;

                var json = await response.Content.ReadAsStringAsync();
                if (string.IsNullOrEmpty(json))
                    return result;

                using var doc = JsonDocument.Parse(json);
                var root = doc.RootElement;

                if (
                    root.TryGetProperty("rhythm", out var rhythm)
                    && rhythm.TryGetProperty("bpm", out var bpmProp)
                )
                {
                    result.Bpm =
                        bpmProp.ValueKind == JsonValueKind.Number
                            ? Math.Round(bpmProp.GetDouble(), 1)
                            : 0;
                }

                if (root.TryGetProperty("tonal", out var tonal))
                {
                    if (tonal.TryGetProperty("key_key", out var key))
                        result.Key = key.GetString() ?? "Unknown";

                    if (tonal.TryGetProperty("key_scale", out var scale))
                        result.Scale = scale.GetString() ?? "Unknown";
                }

                result.Mood = result.Scale.Contains("minor") ? "Somber" : "Bright";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AcousticBrainz Debug]: {ex.Message}");
            }

            return result;
        }
    }
}
