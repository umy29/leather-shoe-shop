using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ShoesController(AppDbContext context)
    {
        _context = context;
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

        return NoContent();
    }

    private bool ShoeExists(int id)
    {
        return _context.Shoes.Any(e => e.Id == id);
    }
}
