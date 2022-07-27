using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Team7.Models.Repository
{
    public interface IWriteOffReasonRepo
    {
        void Add<T>(T Entity) where T : class;

        void Delete<T>(T Entity) where T : class;

        void Update<T>(T Entity) where T : class;

        Task<object> GetAllWriteOffReasonsAsync();

        Task<object> GetWriteOffReasonsAsync(string description);

        Task<object> GetWriteOffReasonIdAsync(int id);

        Task<WriteOffReason> _GetWriteOffReasonIdAsync(int id);

        Task<bool> SaveChangesAsync();
    }
}
