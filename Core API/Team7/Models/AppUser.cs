using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Team7.Models
{
    public class AppUser: IdentityUser
    {
        //can add custom columns to ASPNET.Users in the db

        public virtual Title Title { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string OTP { get; set; }

        public virtual ICollection<PasswordHistory> PasswordHistory { get; set; }

    }
}
