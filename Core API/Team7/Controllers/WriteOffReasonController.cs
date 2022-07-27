using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Team7.Models;
using Team7.Models.Repository;

namespace Team7.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WriteOffReasonController : ControllerBase
    {
        private readonly IWriteOffReasonRepo WriteOffReasonRepo;
        public WriteOffReasonController(IWriteOffReasonRepo writeOffReasonRepo)
        {
            this.WriteOffReasonRepo = writeOffReasonRepo;
        }

        // POST api/writeoffreason/add
        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> PostWriteOffReason(WriteOffReason writeOffReason)
        {
            try
            {
                WriteOffReasonRepo.Add(writeOffReason);
                if (await WriteOffReasonRepo.SaveChangesAsync())
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

        // PUT api/writeoffreason/update/5
        [HttpPut]
        [Route("update")]
        public async Task<IActionResult> PutWriteOffReason(int id, [FromBody] WriteOffReason writeOffReason)
        {
            var toUpdate = await WriteOffReasonRepo._GetWriteOffReasonIdAsync(id);
            if (toUpdate == null)
            {
                return NotFound("Could not find existing Write-off Reason with ID - " + id);
            }
            try
            {
                toUpdate.Description = writeOffReason.Description;

                if (await WriteOffReasonRepo.SaveChangesAsync())
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

        // DELETE api/writeoffreason/delete/5
        [HttpDelete]
        [Route("delete")]
        public async Task<IActionResult> DeleteWriteOffReason(int id)
        {
            var tempWriteOffReason = await WriteOffReasonRepo._GetWriteOffReasonIdAsync(id);
            if (tempWriteOffReason == null)
            {
                return NotFound();
            }
            try
            {
                WriteOffReasonRepo.Delete(tempWriteOffReason);
                if (await WriteOffReasonRepo.SaveChangesAsync())
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

        // GET: api/writeoffreason/getAll
        [HttpGet]
        [Route("getAll")]
        public async Task<object> GetAllWriteOffReasonsAsync()
        {
            try
            {
                var writeOffReasonList = await WriteOffReasonRepo.GetAllWriteOffReasonsAsync();
                if (writeOffReasonList == null)
                {
                    return Ok(0);
                }
                else
                {
                    return Ok(writeOffReasonList);
                }

            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, err.Message);
            }
        }

        // GET: api/writeoffreason/getMatch/{input}
        [HttpGet]
        [Route("getMatch")]
        public async Task<IActionResult> GetMatchingGetMatchingWriteOffReasons(string description)
        {
            try
            {
                var writeOffReason = await WriteOffReasonRepo.GetWriteOffReasonsAsync(description);
                if (writeOffReason == null)
                {
                    return Ok(0);
                }
                else
                {
                    return Ok(writeOffReason);
                }
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, err.Message);
            }

        }
    }
}
