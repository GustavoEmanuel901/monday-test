using SchoolApi.Business.Abstractions.Models;

namespace SchoolApi.Repository.Abstractions;

public interface IEscolaRepository
{
    Task<EscolaRecord?> GetByIdAsync(int id);
    Task<(IReadOnlyList<EscolaRecord> Items, int TotalItems)> ListAsync(
        string? descricaoFilter,
        int page,
        int pageSize);
    Task<EscolaRecord> CreateAsync(EscolaRecord record);
    Task<EscolaRecord?> UpdateAsync(EscolaRecord record);
    Task<bool> DeleteAsync(int id);
}