using Backend.Infrastructure.Persistence;
using Backend.Domain.Entities;
using Backend.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using Backend.Api.Hubs;

namespace Backend.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShoesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IHubContext<AppHub> _hubContext;

    public ShoesController(AppDbContext context, IHubContext<AppHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    // GET: api/shoes
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Shoe>>> GetShoes()
    {
        return await _context.Shoes.OrderByDescending(s => s.CreatedAt).ToListAsync();
    }

    // GET: api/shoes/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Shoe>> GetShoe(int id)
    {
        var shoe = await _context.Shoes.FindAsync(id);

        if (shoe == null)
        {
            return NotFound();
        }

        return shoe;
    }

    // POST: api/shoes
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Shoe>> PostShoe(Shoe shoe)
    {
        _context.Shoes.Add(shoe);
        await _context.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("ShoesUpdated");

        return CreatedAtAction(nameof(GetShoe), new { id = shoe.Id }, shoe);
    }

    // PUT: api/shoes/5
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutShoe(int id, Shoe shoe)
    {
        if (id != shoe.Id)
        {
            return BadRequest();
        }

        _context.Entry(shoe).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ShoeExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        await _hubContext.Clients.All.SendAsync("ShoesUpdated");
        return NoContent();
    }

    // DELETE: api/shoes/5
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteShoe(int id)
    {
        var shoe = await _context.Shoes.FindAsync(id);
        if (shoe == null)
        {
            return NotFound();
        }

        _context.Shoes.Remove(shoe);
        await _context.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("ShoesUpdated");

        return NoContent();
    }

    private bool ShoeExists(int id)
    {
        return _context.Shoes.Any(e => e.Id == id);
    }
}
