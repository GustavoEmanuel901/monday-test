
using Clientes.Business.Abstractions.DTOs;
using SchoolApi.Business.Abstractions.DTOs;
using SchoolApi.Business.Abstractions.Models;

namespace Clientes.Business.Abstractions;

public interface IAlunoService
{
    Task<AlunoDTO?> GetByIdAsync(int id);
    Task<PagedResultDto<AlunoDTO>> ListAsync(
        string? nameFilter,
        string? cpfFilter,
        int page,
        int pageSize);
    Task<IReadOnlyList<AlunoDTO>> GetByEscolaIdAsync(int escolaId);
    Task<AlunoDTO> CreateAsync(CriarAlunoDTO request);
    Task<AlunoDTO?> UpdateAsync(int id, UpdateAlunoDTO request);
    Task<bool> DeleteAsync(int id);
}
