using BuyCrypt.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuyCrypt.Application.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardResponse?> GetDashboardAsync(Guid userId);
    }
}
