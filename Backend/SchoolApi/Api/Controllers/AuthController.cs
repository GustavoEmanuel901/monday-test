using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SchoolApi.Api.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SchoolApi.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public AuthController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost("login")]
    public ActionResult<LoginResponse> Login([FromBody] LoginRequest request)
    {
        // Validar credenciais fixas
        if (request.Usuario != "TESTE" || request.Senha != "123")
        {
            return Unauthorized(new { message = "Usuário ou senha inválidos" });
        }

        var token = GenerateJwtToken(request.Usuario);
        var expiresAt = DateTime.UtcNow.AddHours(8);

        return Ok(new LoginResponse
        {
            Token = token,
            ExpiresAt = expiresAt
        });
    }

    private string GenerateJwtToken(string usuario)
    {
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "ChaveSecretaSuperSeguraParaJWT12345678901234567890");
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, usuario),
                new Claim(ClaimTypes.Role, "User")
            }),
            Expires = DateTime.UtcNow.AddHours(8),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
