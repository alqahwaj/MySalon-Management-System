using Microsoft.EntityFrameworkCore;
using MySalon.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySalon.Infrastructure.Extensions
{
    public static class QueryExtensions
    {
        public static async Task<T?> GetByEmailCustomAsync<T>(this IQueryable<T> query, string email)
            where T : class, IHasEmail
        {
            return await query.FirstOrDefaultAsync(x => x.Email == email);
        }
    }
}
