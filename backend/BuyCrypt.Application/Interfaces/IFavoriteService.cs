using BuyCrypt.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuyCrypt.Application.Interfaces
{
    public interface IFavoriteService
    {
        Task<FavoriteResponse> AddFavoriteAsync(AddFavoriteRequest request);
        Task<FavoriteListResponse> GetUserFavoritesAsync(Guid userId);
        Task<bool> RemoveFavoriteAsync(Guid favoriteId);
    }
}
