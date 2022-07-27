using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Team7.Models.Repository
{
    public interface IRefundReasonRepo
    {
        void Add<T>(T Entity) where T : class;

        void Delete<T>(T Entity) where T : class;

        void Update<T>(T Entity) where T : class;

        Task<object> GetAllRefundReasonsAsync();

        Task<object> GetRefundReasonsAsync(string input);

        Task<object> GetRefundReasonIdAsync(int id);

        Task<RefundReason> _GetRefundReasonIdAsync(int id);

        Task<bool> SaveChangesAsync();
    }
}
