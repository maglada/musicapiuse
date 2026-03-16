using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SpotifyWebApp.Interfaces;
using SpotifyWebApp.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddScoped<ISpotifyService, SpotifyService>();
builder.Services.AddCors(o =>
    o.AddDefaultPolicy(p =>
        p.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()
    )
);
builder.Services.AddSingleton<SpotifyTokenService>();
builder.Services.AddHttpClient();
builder.Services.AddHttpClient<IMusicBrainzService, MusicBrainzService>();

var app = builder.Build();

app.UseCors();
app.UseAuthorization();
app.MapControllers();
app.Run();
