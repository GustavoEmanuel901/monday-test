namespace SchoolApi.Business.Abstractions.Models;

public class AlunoRecord
{
    public int ICodAluno { get; set; }
    public string SNome { get; set; } = string.Empty;
    public string SCpf { get; set; } = string.Empty;
    public string SEndereco { get; set; } = string.Empty;
    public string SCelular { get; set; } = string.Empty;
    public DateTime DNascimento { get; set; }

    public int ICodEscola { get; set; }
}