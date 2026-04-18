using Microsoft.EntityFrameworkCore;
using TechSpace.Api.Data;
using TechSpace.Api.Services;

var builder = WebApplication.CreateBuilder(args);

const string CorsPolicy = "FrontendCors";
var frontendOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? ["http://localhost:5173"];

builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
    {
        policy.WithOrigins(frontendOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
{
    var cs = builder.Configuration.GetConnectionString("Default")
             ?? throw new InvalidOperationException("Connection string 'Default' manquante.");

    options.UseSqlServer(cs);
});

builder.Services.AddScoped<ProductService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition =
            System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var env = scope.ServiceProvider.GetRequiredService<IWebHostEnvironment>();
    var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("Startup");

    logger.LogInformation("Application des migrations pendantes...");
    await db.Database.MigrateAsync();
    await SeedData.SeedAsync(db, env, logger);
}

if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();

app.UseCors(CorsPolicy);
app.UseAuthorization();
app.MapControllers();

app.Run();
