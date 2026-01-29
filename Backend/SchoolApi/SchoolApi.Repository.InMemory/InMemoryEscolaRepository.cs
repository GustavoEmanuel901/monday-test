using System.Collections.Concurrent;
using System.Linq;
using SchoolApi.Business.Abstractions.Models;
using SchoolApi.Repository.Abstractions;

namespace SchoolApi.Repository.InMemory;

public class InMemoryEscolaRepository : IEscolaRepository
{
    private readonly ConcurrentDictionary<int, EscolaRecord> _store = new();

    public Task<EscolaRecord?> GetByIdAsync(int id)
    {
        _store.TryGetValue(id, out var record);
        return Task.FromResult(record);
    }

    public Task<(IReadOnlyList<EscolaRecord> Items, int TotalItems)> ListAsync(
        string? descricaoFilter,
        int page,
        int pageSize)
    {
        var query = _store.Values.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(descricaoFilter))
        {
            query = query.Where(e => e.SDescricao.Contains(descricaoFilter, StringComparison.OrdinalIgnoreCase));
        }

        var totalItems = query.Count();
        var items = query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return Task.FromResult<(IReadOnlyList<EscolaRecord>, int)>((items, totalItems));
    }

    public Task<EscolaRecord> CreateAsync(EscolaRecord record)
    {
        var newId = _store.Any() ? _store.Keys.Max() + 1 : 1;
        var newRecord = new EscolaRecord
        {
            ICodEscola = newId,
            SDescricao = record.SDescricao
        };
        _store[newId] = newRecord;
        return Task.FromResult(newRecord);
    }

    public Task<EscolaRecord?> UpdateAsync(EscolaRecord record)
    {
        if (_store.TryGetValue(record.ICodEscola, out _))
        {
            _store[record.ICodEscola] = record;
            return Task.FromResult<EscolaRecord?>(record);
        }
        return Task.FromResult<EscolaRecord?>(null);
    }

    public Task<bool> DeleteAsync(int id)
    {
        return Task.FromResult(_store.TryRemove(id, out _));
    }
}
