using Backend.Infrastructure.Persistence;
using Backend.Domain.Entities;
using Backend.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using Backend.Api.Hubs;

namespace Backend.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IHubContext<AppHub> _hubContext;

    public OrdersController(AppDbContext context, IHubContext<AppHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
        return await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Shoe)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();
    }

    [HttpGet("test")]
    public async Task<ActionResult> Test()
    {
        var items = await _context.OrderItems.ToListAsync();
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(Order order)
    {
        // Generate a unique order number
        order.OrderNumber = "ORD-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
        order.OrderDate = DateTime.UtcNow;

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("OrdersUpdated");

        return CreatedAtAction(nameof(GetOrders), new { id = order.Id }, order);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrder(int id)
    {
        var order = await _context.Orders.Include(o => o.OrderItems).FirstOrDefaultAsync(o => o.Id == id);
        if (order == null)
        {
            return NotFound();
        }

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("OrdersUpdated");

        return NoContent();
    }
}
