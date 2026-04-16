using BuyCrypt.Application.DTOs;
using BuyCrypt.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BuyCrypt.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoritesController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;

        public FavoritesController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        [HttpPost]
        public async Task<IActionResult> AddFavorite([FromBody] AddFavoriteRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var favorite = await _favoriteService.AddFavoriteAsync(request);
            return CreatedAtAction(nameof(GetUserFavorites), new { userId = request.UserId }, favorite);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserFavorites(Guid userId)
        {
            var favorites = await _favoriteService.GetUserFavoritesAsync(userId);
            return Ok(favorites);
        }

        [HttpDelete("{favoriteId}")]
        public async Task<IActionResult> RemoveFavorite(Guid favoriteId)
        {
            var removed = await _favoriteService.RemoveFavoriteAsync(favoriteId);
            if (!removed)
                return NotFound(new { message = "Favorite not found" });

            return NoContent();
        }
    }
}
