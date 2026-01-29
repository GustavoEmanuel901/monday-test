
using Clientes.Business.Abstractions.DTOs;
using SchoolApi.Business.Abstractions.DTOs;
using SchoolApi.Business.Abstractions.Models;

namespace Clientes.Business.Abstractions;

public interface IAlunoService
{
    Task<AlunoDTO?> GetByIdAsync(int id);
    Task<PagedResultDto<AlunoDTO>> ListAsync(
        string? nameFilter,
        string? emailFilter,
        bool? activeFilter,
        string? sortField,
        string? sortDir,
        int page,
        int pageSize);
    Task<AlunoDTO> CreateAsync(CriarAlunoDTO request);
    Task<AlunoDTO?> UpdateAsync(int id, UpdateAlunoDTO request);
    Task<bool> DeleteAsync(int id);
}
