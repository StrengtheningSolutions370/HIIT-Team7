using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Team7.Models.Repository
{
    public interface IPasswordHistoryRepo
    {
        void Add<T>(T Entity) where T : class;

        void Delete<T>(T Entity) where T : class;

        void Update<T>(T Entity) where T : class;

        public Task<PasswordHistory[]> GetByUserIdAsync(string id);

        //Task<PasswordHistory[]> GetAllPasswordHistorysAsync();

        //Task<PasswordHistory[]> GetPasswordHistorysAsync(string input);

        //Task<PasswordHistory> GetPasswordHistoryIdAsync(int id);

        Task<bool> SaveChangesAsync();
    }
}
