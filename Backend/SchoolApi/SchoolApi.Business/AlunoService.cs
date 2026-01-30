using System.Text.RegularExpressions;
using Clientes.Business.Abstractions;
using Clientes.Business.Abstractions.DTOs;
using SchoolApi.Business.Abstractions.DTOs;
using SchoolApi.Business.Abstractions.Models;
using SchoolApi.Repository.Abstractions;

namespace SchoolApi.Business;

public class AlunoService : IAlunoService
{
    private readonly IAlunoRepository _repository;
    private readonly IEscolaRepository _escolaRepository;

    public AlunoService(IAlunoRepository repository, IEscolaRepository escolaRepository)
    {
        _repository = repository;
        _escolaRepository = escolaRepository;
    }

    public async Task<AlunoDTO?> GetByIdAsync(int id)
    {
        var rec = await _repository.GetByIdAsync(id);
        return rec is null ? null : ToDto(rec);
    }

    public async Task<PagedResultDto<AlunoDTO>> ListAsync(
        string? nameFilter,
        string? cpfFilter,
        int page,
        int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : pageSize;

        var result = await _repository.ListAsync(nameFilter, cpfFilter, page, pageSize);
        var items = result.Items.Select(ToDto).ToList();

        return new PagedResultDto<AlunoDTO>
        {
            Itens = items,
            Pagina = page,
            TamanhoPagina = pageSize,
            TotalItens = result.TotalItems
        };
    }

    public async Task<AlunoDTO> CreateAsync(CriarAlunoDTO request)
    {
        ValidateCreate(request);
        await EnsureCpfUniqueAsync(request.Cpf, null);
        await EnsureEscolaExistsAsync(request.CodEscola);
        var rec = new AlunoRecord
        {
            SNome = request.Nome.Trim(),
            SCpf = request.Cpf.Trim(),
            SEndereco = request.Endereco.Trim(),
            SCelular = request.Celular.Trim(),
            DNascimento = request.DataNascimento,
            ICodEscola = request.CodEscola
        };
        var created = await _repository.CreateAsync(rec);
        return ToDto(created);
    }

    public async Task<AlunoDTO?> UpdateAsync(int id, UpdateAlunoDTO request)
    {
        ValidateUpdate(request);
        var existing = await _repository.GetByIdAsync(id);
        if (existing is null) return null;
        
        await EnsureCpfUniqueAsync(request.Cpf, id);
        await EnsureEscolaExistsAsync(request.CodEscola);
        
        existing.SNome = request.Nome.Trim();
        existing.SCpf = request.Cpf.Trim();
        existing.SEndereco = request.Endereco.Trim();
        existing.SCelular = request.Celular.Trim();
        existing.DNascimento = request.DataNascimento;
        existing.ICodEscola = request.CodEscola;
        
        var updated = await _repository.UpdateAsync(existing);
        return updated is null ? null : ToDto(updated);
    }

    public async Task<IReadOnlyList<AlunoDTO>> GetByEscolaIdAsync(int escolaId)
    {
        await EnsureEscolaExistsAsync(escolaId);
        var records = await _repository.GetByEscolaIdAsync(escolaId);
        return records.Select(ToDto).ToList();
    }

    public Task<bool> DeleteAsync(int id) => _repository.DeleteAsync(id);

    private void ValidateCreate(CriarAlunoDTO r)
    {
        if (string.IsNullOrWhiteSpace(r.Nome)) 
            throw new ArgumentException("Nome é obrigatório", nameof(r.Nome));
        if (string.IsNullOrWhiteSpace(r.Cpf)) 
            throw new ArgumentException("CPF é obrigatório", nameof(r.Cpf));
        if (string.IsNullOrWhiteSpace(r.Celular) || !Regex.IsMatch(r.Celular, @"^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$")) 
            throw new ArgumentException("Celular inválido. Use formato: (41) 996814278 ou 41996814278", nameof(r.Celular));
        if (r.DataNascimento == default) 
            throw new ArgumentException("Data de nascimento inválida", nameof(r.DataNascimento));
    }

    private void ValidateUpdate(UpdateAlunoDTO r)
    {
        if (string.IsNullOrWhiteSpace(r.Nome)) 
            throw new ArgumentException("Nome é obrigatório", nameof(r.Nome));
        if (string.IsNullOrWhiteSpace(r.Cpf)) 
            throw new ArgumentException("CPF é obrigatório", nameof(r.Cpf));
        if (string.IsNullOrWhiteSpace(r.Celular) || !Regex.IsMatch(r.Celular, @"^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$")) 
            throw new ArgumentException("Celular inválido. Use formato: (41) 996814278 ou 41996814278", nameof(r.Celular));
        if (r.DataNascimento == default) 
            throw new ArgumentException("Data de nascimento inválida", nameof(r.DataNascimento));
    }

    private async Task EnsureCpfUniqueAsync(string cpf, int? ignoreId)
    {
        var found = await _repository.GetByCpfAsync(cpf.Trim());
        if (found != null && (!ignoreId.HasValue || found.ICodAluno != ignoreId.Value))
            throw new InvalidOperationException("CPF já cadastrado");
    }

    private async Task EnsureEscolaExistsAsync(int codEscola)
    {
        var escola = await _escolaRepository.GetByIdAsync(codEscola);
        if (escola == null)
            throw new ArgumentException($"Escola com código {codEscola} não encontrada", nameof(codEscola));
    }

    private static AlunoDTO ToDto(AlunoRecord r) => new()
    {
        CodAluno = r.ICodAluno,
        Nome = r.SNome,
        Cpf = r.SCpf,
        Endereco = r.SEndereco,
        Celular = r.SCelular,
        DataNascimento = r.DNascimento,
        CodEscola = r.ICodEscola
    };
}