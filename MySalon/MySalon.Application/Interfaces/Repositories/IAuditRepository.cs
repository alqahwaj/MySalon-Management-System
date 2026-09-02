using MySalon.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySalon.Application.Interfaces.Repositories
{
    public interface IAuditRepository
    {
        Task AddAsync(AuditLog auditLog);
    }
}
