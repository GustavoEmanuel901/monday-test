namespace SchoolApi.Business.Abstractions.DTOs;

using System.ComponentModel.DataAnnotations;

public class UpdateAlunoDTO
{
    public string Nome { get; set; } = string.Empty;
    [RegularExpression(@"^\d{8,}$", ErrorMessage = "Celular deve ter no mínimo 8 dígitos")]
    public string Celular { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string Endereco { get; set; } = string.Empty;
    public DateTime DataNascimento { get; set; }
}