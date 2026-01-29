namespace SchoolApi.Business.Abstractions.Models;

public class AlunoDTO
{
    public int CodAluno { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string Endereco { get; set; } = string.Empty;
    public string Celular { get; set; } = string.Empty;
    public DateTime DataNascimento { get; set; }

    public int CodEscola { get; set; }
}