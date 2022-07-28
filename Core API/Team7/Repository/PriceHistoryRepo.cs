using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Team7.Context;


namespace Team7.Models.Repository
{
    public class PriceHistoryRepo : IPriceHistoryRepo
    {
        readonly private AppDB DB;

        public PriceHistoryRepo(AppDB appDatabaseContext)
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

        
 
        //public async Task<PriceHistory[]> GetAllPriceHistorysAsync()
        //{
        //    IQueryable<PriceHistory> query = DB.PriceHistory;
        //    return await query.ToArrayAsync();
        //    return null;

        //}

        //public async Task<PriceHistory[]> GetPriceHistorysAsync(string input)
        //{
        //    IQueryable<PriceHistory> query = DB.PriceHistory.Where(v => v == input || v. == input);
        //    if (!query.Any())
        //    {
        //        return null;
        //    }
        //    else
        //    {
        //       return await query.ToArrayAsync();
        //    }
        //    return null;
        //}

        //public async Task<PriceHistory> GetPriceHistoryIdAsync(int id)
        //{
        //    IQueryable<PriceHistory> query = DB.PriceHistory.Where(v => v.VenueID == id);
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
