using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Team7.Context;


namespace Team7.Models.Repository
{
    public class PasswordHistoryRepo : IPasswordHistoryRepo
    {
        readonly private AppDB DB;

        public PasswordHistoryRepo(AppDB appDatabaseContext)
        {
            DB = appDatabaseContext;
        }

        public void Add<T>(T Entity) where T : class
        {
            DB.Add(Entity);
        }

        public void Delete<T>(T Entity) where T : class
        {
            DB.Remove(Entity);
        }
        public void Update<T>(T Entity) where T : class
        {
            DB.Update(Entity);
        }

        public async Task<PasswordHistory[]> GetByUserIdAsync(string id)
        {
            IQueryable<PasswordHistory> query = DB.PasswordHistory.Where(h => h.UserID == id);
            if (!query.Any())
                return null;
            return await query.ToArrayAsync();
        }


        //public async Task<PasswordHistory[]> GetAllPasswordHistorysAsync()
        //{
        //    IQueryable<PasswordHistory> query = DB.PasswordHistory;
        //    return await query.ToArrayAsync();
        //    return null;

        //}

        //public async Task<PasswordHistory[]> GetPasswordHistorysAsync(string input)
        //{
        //    IQueryable<PasswordHistory> query = DB.PasswordHistory.Where(v => v.Name == input || v.Address == input);
        //    if (!query.Any())
        //    {
        //        return null;
        //    }
        //    else
        //    {
        //        return await query.ToArrayAsync();
        //    }
        //    return null;

        //}

        //public async Task<PasswordHistory> GetPasswordHistoryIdAsync(int id)
        //{
        //    IQueryable<PasswordHistory> query = DB.PasswordHistory.Where(v => v.VenueID == id);
        //    if (!query.Any())
        //    {
        //        return null;
        //    }
        //    else
        //    {
        //        return await query.SingleAsync();
        //    }
        //    return null;
        //}

        public async Task<bool> SaveChangesAsync()
        {
            //Returns true/false based on success/failure
            return await DB.SaveChangesAsync() > 0;
        }
    }
}
