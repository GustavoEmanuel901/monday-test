using Clientes.Business.Abstractions.DTOs;
using SchoolApi.Business.Abstractions.DTOs;
using SchoolApi.Business.Abstractions.Models;

namespace SchoolApi.Business.Abstractions;

public interface IEscolaService
{
    Task<EscolaDTO?> GetByIdAsync(int id);
    Task<PagedResultDto<EscolaDTO>> ListAsync(
        string? descricaoFilter,
        int page,
        int pageSize);
    Task<EscolaDTO> CreateAsync(CriarEscolaDTO request);
    Task<EscolaDTO?> UpdateAsync(int id, UpdateEscolaDTO request);
    Task<bool> DeleteAsync(int id);
}
