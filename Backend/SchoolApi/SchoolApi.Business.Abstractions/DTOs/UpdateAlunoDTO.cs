namespace SchoolApi.Business.Abstractions.DTOs;

using System.ComponentModel.DataAnnotations;

public class UpdateAlunoDTO
{
    public string Nome { get; set; } = string.Empty;
    public string Celular { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string Endereco { get; set; } = string.Empty;
    public DateTime DataNascimento { get; set; }

    public int CodEscola { get; set; }
}