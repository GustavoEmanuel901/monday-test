using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Clientes.Business.Abstractions;
using Clientes.Business.Abstractions.DTOs;
using SchoolApi.Business.Abstractions.DTOs;
using SchoolApi.Business.Abstractions.Models;

namespace SchoolApi.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AlunosController : ControllerBase
{
    private readonly IAlunoService _service;
    
    public AlunosController(IAlunoService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<PagedResultDto<AlunoDTO>>> List(
        [FromQuery] string? nome,
        [FromQuery] string? cpf,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await _service.ListAsync(nome, cpf, page, pageSize);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AlunoDTO>> GetById(int id)
    {
        var dto = await _service.GetByIdAsync(id);
        if (dto is null) return NotFound();
        return Ok(dto);
    }

    [HttpGet("escola/{escolaId:int}")]
    public async Task<ActionResult<IReadOnlyList<AlunoDTO>>> GetByEscola(int escolaId)
    {
        try
        {
            var alunos = await _service.GetByEscolaIdAsync(escolaId);
            return Ok(alunos);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<AlunoDTO>> Create([FromBody] CriarAlunoDTO request)
    {
        try
        {
            var created = await _service.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = created.CodAluno }, created);
        }
        catch (ArgumentException ex)
        {
            return ValidationProblem(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { error = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<AlunoDTO>> Update(int id, [FromBody] UpdateAlunoDTO request)
    {
        try
        {
            var updated = await _service.UpdateAsync(id, request);
            if (updated is null) return NotFound();
            return Ok(updated);
        }
        catch (ArgumentException ex)
        {
            return ValidationProblem(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { error = ex.Message });
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
        var ok = await _service.DeleteAsync(id);
        if (!ok) return NotFound();
        return NoContent();
    }
}
