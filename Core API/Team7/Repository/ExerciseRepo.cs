using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Team7.Context;
using Microsoft.EntityFrameworkCore;


namespace Team7.Models.Repository
{
    public class ExerciseRepo : IExerciseRepo
    {
        readonly private AppDB DB;

        public ExerciseRepo(AppDB appDatabaseContext)
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


        public async Task<object> GetAllExercisesAsync()
        {
            IQueryable<Exercise> query = DB.Exercise;
            if (!query.Any())
            {
                return null;
            }
            else
            {
                return new
                {
                    result = await DB.Exercise.Select(e => new
                    {
                        e.ExerciseID,
                        e.Name,
                        e.Description,
                        ExerciseCategory = new { e.ExerciseCategoryID, e.Name, e.Description }
                    }).ToListAsync()
                };
            }

        }

            public async Task<object> GetExercisesAsync(string description, string name)
            {
                IQueryable<Exercise> query = DB.Exercise.Where(e => e.Name == name || e.Description == description);

                if (!query.Any())
                {
                    return null;
                }
                else
                {
                    return new
                    {
                        result = await query.Select(e => new
                        {
                            e.ExerciseID,
                            e.Description,
                            e.ExerciseCategoryID,
                            e.ExerciseCategory
                        }).ToListAsync()
                    };
                }
            }

        public async Task<object> GetExerciseIdAsync(int id)
        {
            IQueryable<Exercise> query = DB.Exercise.Where(e => e.ExerciseID == id);
            if (!query.Any())
            {
                return null;
            }
            else
            {
                return new
                {
                    result = await query.Select(e => new
                    {
                        e.ExerciseCategoryID,
                        e.Description,
                        ExerciseCategory = new
                        {
                            e.ExerciseCategoryID,
                            e.ExerciseCategory
                        }
                    }).ToListAsync()
                };
            }
        }

        public async Task<Exercise> _GetExerciseIdAsync(int id)
        {
            IQueryable<Exercise> query = DB.Exercise.Where(e => e.ExerciseID == id);
            if (!query.Any())
            {
                return null;
            }
            else
            {
                return await query.SingleAsync();
            }
        }

        public async Task<bool> SaveChangesAsync()
        {
            //Returns true/false based on success/failure
            return await DB.SaveChangesAsync() > 0;
        }
    }
}
