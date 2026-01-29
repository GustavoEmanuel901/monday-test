using Clientes.Business.Abstractions.DTOs;
using SchoolApi.Business.Abstractions;
using SchoolApi.Business.Abstractions.DTOs;
using SchoolApi.Business.Abstractions.Models;
using SchoolApi.Repository.Abstractions;

namespace SchoolApi.Business;

public class EscolaService : IEscolaService
{
    private readonly IEscolaRepository _repository;

    public EscolaService(IEscolaRepository repository)
    {
        _repository = repository;
    }

    public async Task<EscolaDTO?> GetByIdAsync(int id)
    {
        var rec = await _repository.GetByIdAsync(id);
        return rec is null ? null : ToDto(rec);
    }

    public async Task<PagedResultDto<EscolaDTO>> ListAsync(
        string? descricaoFilter,
        int page,
        int pageSize)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize <= 0 ? 10 : pageSize;

        var result = await _repository.ListAsync(descricaoFilter, page, pageSize);
        var items = result.Items.Select(ToDto).ToList();

        return new PagedResultDto<EscolaDTO>
        {
            Itens = items,
            Pagina = page,
            TamanhoPagina = pageSize,
            TotalItens = result.TotalItems
        };
    }

    public async Task<EscolaDTO> CreateAsync(CriarEscolaDTO request)
    {
        ValidateCreate(request);
        var rec = new EscolaRecord
        {
            SDescricao = request.Descricao.Trim()
        };
        var created = await _repository.CreateAsync(rec);
        return ToDto(created);
    }

    public async Task<EscolaDTO?> UpdateAsync(int id, UpdateEscolaDTO request)
    {
        ValidateUpdate(request);
        var existing = await _repository.GetByIdAsync(id);
        if (existing is null) return null;
        
        existing.SDescricao = request.Descricao.Trim();
        
        var updated = await _repository.UpdateAsync(existing);
        return updated is null ? null : ToDto(updated);
    }

    public Task<bool> DeleteAsync(int id) => _repository.DeleteAsync(id);

    private void ValidateCreate(CriarEscolaDTO r)
    {
        if (string.IsNullOrWhiteSpace(r.Descricao)) 
            throw new ArgumentException("Descrição é obrigatória", nameof(r.Descricao));
    }

    private void ValidateUpdate(UpdateEscolaDTO r)
    {
        if (string.IsNullOrWhiteSpace(r.Descricao)) 
            throw new ArgumentException("Descrição é obrigatória", nameof(r.Descricao));
    }

    private static EscolaDTO ToDto(EscolaRecord r) => new()
    {
        CodEscola = r.ICodEscola,
        Descricao = r.SDescricao
    };
}
