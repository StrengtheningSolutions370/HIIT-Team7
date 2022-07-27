using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Team7.Models.Repository;
using Team7.Models;

namespace Team7.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RefundReasonController : ControllerBase
    {
        private readonly IRefundReasonRepo RefundReasonRepo;
        public RefundReasonController(IRefundReasonRepo refundReasonRepo)
        {
            this.RefundReasonRepo = refundReasonRepo;
        }

        // POST api/refundreason/add
        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> PostRefundReason(RefundReason refundReason)
        {
            try
            {
                RefundReasonRepo.Add(refundReason);
                if (await RefundReasonRepo.SaveChangesAsync())
                {
                    return Ok();
                }
                else
                {
                    return StatusCode(StatusCodes.Status503ServiceUnavailable, "Unable to add value in the database. Contact support.");
                }

            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, err.Message);
            }

        }

        // PUT api/refundReason/update/5
        [HttpPut]
        [Route("update")]
        public async Task<IActionResult> PutRefundReason(int id, [FromBody] RefundReason refundReason)
        {
            var toUpdate = await RefundReasonRepo._GetRefundReasonIdAsync(id);
            if (toUpdate == null)
            {
                return NotFound("Could not find existing Refund Reason with ID - " + id);
            }
            try
            {
                toUpdate.Description = refundReason.Description;

                if (await RefundReasonRepo.SaveChangesAsync())
                {
                    return Ok();
                }
                else
                {
                    return StatusCode(StatusCodes.Status503ServiceUnavailable, "Unable to update value in the database. Contact support.");
                }

            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, err.Message);
            }
        }

        // DELETE api/refundreason/delete/5
        [HttpDelete]
        [Route("delete")]
        public async Task<IActionResult> DeleteRefundReason(int id)
        {
            var tempRefundReason = await RefundReasonRepo._GetRefundReasonIdAsync(id);
            if (tempRefundReason == null)
            {
                return NotFound();
            }
            try
            {
                RefundReasonRepo.Delete<RefundReason>(tempRefundReason);
                if (await RefundReasonRepo.SaveChangesAsync())
                {
                    return Ok();
                }
                else
                {
                    return StatusCode(StatusCodes.Status503ServiceUnavailable, "Unable to delete value in the database. Contact support.");
                }

            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, err.Message);
            }
        }

        // GET: api/refundreason/getAll
        [HttpGet]
        [Route("getAll")]
        public async Task<IActionResult> GetRefundReasons()
        {
            try
            {
                var refundReasonList = await RefundReasonRepo.GetAllRefundReasonsAsync();
                if (refundReasonList == null)
                {
                    return Ok(0);
                }
                else
                {
                    return Ok(refundReasonList);
                }

            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, err.Message);
            }
        }

        // GET: api/refundreason/getMatch/{input}
        [HttpGet]
        [Route("getMatch")]
        public async Task<IActionResult> GetMatchingRefundReasons(string description)
        {
            try
            {
                var refundReason = await RefundReasonRepo.GetRefundReasonsAsync(description);
                if (refundReason == null) return Ok(0);
                return Ok(refundReason);
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, err.Message);
            }

        }
    }
}
