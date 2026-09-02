using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySalon.Domain.Entities
{
    public class AuditLog
    {
        protected AuditLog() { }

        public AuditLog(string userId, string action, string entityName, string entityId)
        {
            Id = Guid.NewGuid();
            UserId = userId;
            Action = action;
            EntityName = entityName;
            EntityId = entityId;
            Timestamp = DateTime.UtcNow;
        }

        public Guid Id { get; private set; }
        public string UserId { get; private set; }
        public string Action { get; private set; }
        public string EntityName { get; private set; }
        public string EntityId { get; private set; }
        public DateTime Timestamp { get; private set; }
    }
}
