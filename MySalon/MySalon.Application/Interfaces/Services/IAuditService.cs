using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySalon.Application.Interfaces.Services
{
    public interface IAuditService
    {
        Task LogActionAsync(string userId, string action, string entityName, string entityId);
    }
}
