using BuyCrypt.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BuyCrypt.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetDashboard(Guid userId)
        {
            var dashboard = await _dashboardService.GetDashboardAsync(userId);
            if (dashboard == null)
                return NotFound(new { message = "User not found" });

            return Ok(dashboard);
        }
    }
}
