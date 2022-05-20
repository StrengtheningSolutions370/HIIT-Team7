﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Team7.Models.Repository
{
    interface ISupplierRepo
    {
        void Add<T>(T Entity) where T : class;

        void Delete<T>(T Entity) where T : class;

        void Update<T>(T Entity) where T : class;

        //Task<Supplier[]> GetAllSuppliersAsync();

        //Task<Supplier[]> GetSuppliersAsync(string input);

        //Task<Supplier> GetSupplierIdAsync(int id);

        Task<bool> SaveChangesAsync();
    }
}
