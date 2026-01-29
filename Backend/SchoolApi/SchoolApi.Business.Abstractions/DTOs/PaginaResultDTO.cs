namespace Clientes.Business.Abstractions.DTOs;

public class PagedResultDto<T>
{
    public IReadOnlyList<T> Itens { get; init; } = Array.Empty<T>();
    public int Pagina { get; init; }
    public int TamanhoPagina { get; init; }
    public int TotalItens { get; init; }
}