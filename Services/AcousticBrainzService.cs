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

        // recordingId is now the Spotify track ID (passed from SpotifyController)
        public async Task<MusicMetadataResult> GetTechnicalDetailsAsync(string recordingId)
        {
            var result = new MusicMetadataResult();

            if (string.IsNullOrEmpty(recordingId))
                return result;

            var url = $"https://api.reccobeats.com/v1/track/{recordingId}/audio-feature";

            try
            {
                var response = await _http.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                    return result;

                var json = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                var root = doc.RootElement;

                if (root.TryGetProperty("tempo", out var tempo))
                    result.Bpm = Math.Round(tempo.GetDouble(), 1);

                // ReccoBeats does not provide key/scale — stays "Unknown"

                // Derive mood from valence (0–1 scale)
                if (root.TryGetProperty("valence", out var valence))
                {
                    var v = valence.GetDouble();
                    result.Mood =
                        v >= 0.6 ? "Happy"
                        : v >= 0.4 ? "Neutral"
                        : "Melancholic";
                }
            }
            catch { }

            return result;
        }
    }
}
