using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySalon.Application.Exceptions
{
    public class ForbiddenAccessException : Exception
    {
        public ForbiddenAccessException()
            : base("You do not have permission to access or modify this record.")
        {
        }

        public ForbiddenAccessException(string message) : base(message)
        {
        }
    }
}
