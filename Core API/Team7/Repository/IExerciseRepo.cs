using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Team7.ViewModels;

namespace Team7.Models.Repository
{
    public interface IExerciseRepo
    {
        void Add<T>(T Entity) where T : class;

        void Delete<T>(T Entity) where T : class;

        void Update<T>(T Entity) where T : class;

        Task<object> GetAllExercisesAsync();
        Task<object> GetExercisesAsync(string name, string description);
        Task<object> GetExerciseIdAsync(int id);
        Task<Exercise> _GetExerciseIdAsync(int id);

        Task<bool> SaveChangesAsync();
    }
}
