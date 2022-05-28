﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Team7.Models.Repository
{
    public interface IQualificationTypeRepo
    {
        void Add<T>(T Entity) where T : class;

        void Delete<T>(T Entity) where T : class;

        void Update<T>(T Entity) where T : class;

        Task<QualificationType[]> GetAllQualificationTypesAsync();

        Task<QualificationType[]> GetQualificationTypesAsync(string input);

        Task<QualificationType> GetQualificationTypeIdAsync(int id);

        Task<bool> SaveChangesAsync();
        
    }
}
