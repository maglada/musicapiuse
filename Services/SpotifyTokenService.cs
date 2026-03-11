using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using SpotifyAPI.Web;
using SpotifyWebApp.Interfaces;

namespace SpotifyWebApp.Services
{
    public class SpotifyTokenService
    {
        private string? _accessToken;
        private string? _refreshToken;
        private DateTime _expiry;

        public void Store(string accessToken, string refreshToken)
        {
            _accessToken = accessToken;
            _refreshToken = refreshToken;
            _expiry = DateTime.UtcNow.AddSeconds(3600);
        }

        public string? GetToken() => DateTime.UtcNow < _expiry ? _accessToken : null;

        public bool IsExpired() => DateTime.UtcNow >= _expiry;

        public string? RefreshToken => _refreshToken;
    }
}
