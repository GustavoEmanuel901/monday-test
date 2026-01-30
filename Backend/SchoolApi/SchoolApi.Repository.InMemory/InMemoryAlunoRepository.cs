using System.Collections.Concurrent;
using SchoolApi.Business.Abstractions.Models;
using SchoolApi.Repository.Abstractions;

namespace SchoolApi.Repository.InMemory;

public class InMemoryAlunoRepository : IAlunoRepository
{
    private readonly ConcurrentDictionary<int, AlunoRecord> _store = new();

    public Task<AlunoRecord?> GetByIdAsync(int id)
    {
        _store.TryGetValue(id, out var record);
        return Task.FromResult(record);
    }

    public Task<AlunoRecord?> GetByCpfAsync(string cpf)
    {
        var record = _store.Values.FirstOrDefault(a => a.SCpf == cpf);
        return Task.FromResult(record);
    }

    public Task<(IReadOnlyList<AlunoRecord> Items, int TotalItems)> ListAsync(
        string? nameFilter,
        string? cpfFilter,
        int page,
        int pageSize)
    {
        var query = _store.Values.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(nameFilter))
        {
            query = query.Where(a => a.SNome.Contains(nameFilter, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(cpfFilter))
        {
            query = query.Where(a => a.SCpf.Contains(cpfFilter));
        }

        var totalItems = query.Count();
        var items = query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return Task.FromResult<(IReadOnlyList<AlunoRecord>, int)>((items, totalItems));
    }

    public Task<IReadOnlyList<AlunoRecord>> GetByEscolaIdAsync(int escolaId)
    {
        var alunos = _store.Values
            .Where(a => a.ICodEscola == escolaId)
            .ToList();
        return Task.FromResult<IReadOnlyList<AlunoRecord>>(alunos);
    }

    public Task<AlunoRecord> CreateAsync(AlunoRecord record)
    {
        var newId = _store.Any() ? _store.Keys.Max() + 1 : 1;
        var newRecord = new AlunoRecord
        {
            ICodAluno = newId,
            SNome = record.SNome,
            SCpf = record.SCpf,
            SEndereco = record.SEndereco,
            SCelular = record.SCelular,
            DNascimento = record.DNascimento,
            ICodEscola = record.ICodEscola
        };
        _store[newId] = newRecord;
        return Task.FromResult(newRecord);
    }

    public Task<AlunoRecord?> UpdateAsync(AlunoRecord record)
    {
        if (_store.TryGetValue(record.ICodAluno, out _))
        {
            _store[record.ICodAluno] = record;
            return Task.FromResult<AlunoRecord?>(record);
        }
        return Task.FromResult<AlunoRecord?>(null);
    }

    public Task<bool> DeleteAsync(int id)
    {
        return Task.FromResult(_store.TryRemove(id, out _));
    }
}