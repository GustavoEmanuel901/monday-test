using Microsoft.OpenApi.Models;
using Clientes.Business.Abstractions;
using SchoolApi.Business;
using SchoolApi.Business.Abstractions;
using SchoolApi.Repository.Abstractions;
using SchoolApi.Repository.InMemory;

var builder = WebApplication.CreateBuilder(args);

// Configurar para rodar na porta 8080
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(8080);
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "School API", Version = "v1" });
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Registrar repositórios
builder.Services.AddSingleton<IAlunoRepository, InMemoryAlunoRepository>();
builder.Services.AddSingleton<IEscolaRepository, InMemoryEscolaRepository>();

// Registrar serviços
builder.Services.AddScoped<IAlunoService, AlunoService>();
builder.Services.AddScoped<IEscolaService, EscolaService>();

var app = builder.Build();

app.UseCors();
app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

app.Run();