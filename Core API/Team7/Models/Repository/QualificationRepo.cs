﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Team7.Context;


namespace Team7.Models.Repository
{
    public class QualificationRepo //: IQualificationRepo
    {
        readonly private AppDB DB;

        public QualificationRepo(AppDB appDatabaseContext)
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


        //public async Task<Qualification[]> GetAllQualificationsAsync()
        //{
        //    IQueryable<Qualification> query = DB.Qualification;
        //    return await query.ToArrayAsync();
        //    return null;

        //}

        //public async Task<Qualification[]> GetQualificationsAsync(string input)
        //{
        //    IQueryable<Qualification> query = DB.Qualification.Where(v => v.Name == input || v.Address == input);
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

        //public async Task<Qualification> GetQualificationIdAsync(int id)
        //{
        //    IQueryable<Qualification> query = DB.Qualification.Where(v => v.VenueID == id);
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
