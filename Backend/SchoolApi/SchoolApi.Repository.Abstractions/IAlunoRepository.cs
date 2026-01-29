using SchoolApi.Business.Abstractions.Models;

namespace SchoolApi.Repository.Abstractions;

public interface IAlunoRepository
{
    Task<AlunoRecord?> GetByIdAsync(int id);
    Task<AlunoRecord?> GetByCpfAsync(string cpf);
    Task<(IReadOnlyList<AlunoRecord> Items, int TotalItems)> ListAsync(
        string? nameFilter,
        string? cpfFilter,
        int page,
        int pageSize);
    Task<AlunoRecord> CreateAsync(AlunoRecord record);
    Task<AlunoRecord?> UpdateAsync(AlunoRecord record);
    Task<bool> DeleteAsync(int id);
}