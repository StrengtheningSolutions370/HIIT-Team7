using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Team7.Context;


namespace Team7.Models.Repository
{
    public class RefundReasonRepo : IRefundReasonRepo
    {
        readonly private AppDB DB;

        public RefundReasonRepo(AppDB appDatabaseContext)
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


        public async Task<object> GetAllRefundReasonsAsync()
        {
            IQueryable<RefundReason> query = DB.RefundReason;
            if (!query.Any())
            {
                return null;
            }
            return new
            {
                result = await DB.RefundReason.Select(rr => new
                {
                    rr.RefundReasonID,
                    rr.Description,
                    Refund = rr
                .Refund
                .Select(r => new { r.RefundID, r.Notes, r.Date, r.Payment, r.Total , r.PaymentID} )
                }).ToListAsync()
            };

        }

        public async Task<object> GetRefundReasonsAsync(string input)
        {
            IQueryable<RefundReason> query = DB.RefundReason.Where(rr => rr.Description == input);
            if (!query.Any())
            {
                return null;
            }
            else
            {
                return new
                {
                    result = await query.Select(rr => new
                    {
                        rr.RefundReasonID,
                        rr.Description,
                        Refund = rr
                            .Refund
                            .Select(r => new { r.RefundID, r.Date, r.Notes, r.Payment, r.PaymentID })
                    }).ToListAsync()
                };
            }

        }

        public async Task<object> GetRefundReasonIdAsync(int id)
        {
            IQueryable<RefundReason> query = DB.RefundReason.Where(rr => rr.RefundReasonID == id);
            if (!query.Any())
            {
                return null;
            }
            else
            {
                return new
                {
                    result = await query.Select(rr => new
                    {
                        rr.RefundReasonID,
                        rr.Description,
                        Refund = rr
                            .Refund
                            .Select(r => new { r.RefundID, r.Date, r.Notes, r.Payment, r.PaymentID })
                    }).ToListAsync()
                };
            }
        }

        public async Task<RefundReason> _GetRefundReasonIdAsync(int id)
        {
            IQueryable<RefundReason> query = DB.RefundReason.Where(rr => rr.RefundReasonID == id);
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
