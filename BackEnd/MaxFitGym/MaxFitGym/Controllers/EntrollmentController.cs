using MaxFitGym.IRepository;
using MaxFitGym.Models.RequestModel;
using MaxFitGym.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MaxFitGym.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntrollmentController : ControllerBase
    {
        private readonly IEnrollmentRepository _enrollmentRepository;

        public EntrollmentController(IEnrollmentRepository enrollmentRepository)
        {
            _enrollmentRepository = enrollmentRepository;
        }

        [HttpPost("Add-Enrollment")]
        public IActionResult AddEnrollment([FromForm] EnrollmentRequestDTO enrollmentRequestDTO)
        {
            _enrollmentRepository.AddEnrollment(enrollmentRequestDTO);
            return Ok(enrollmentRequestDTO);
        }

        [HttpGet("Get-All-Enrollment")]
        public async Task<IActionResult> GetAllEnrollments()
        {
            var EnrollList = _enrollmentRepository.GetAllEnrollments();
            return Ok(EnrollList);
        }

        [HttpGet("Get-Enrollment-By-ID /{Id}")]
        public IActionResult GetEnrollmentById(long Id)
        {
            try
            {
                var enroll = _enrollmentRepository.GetEnrollmentById(Id);

                return Ok(enroll);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("Delete-Enrollment/{Id}")]
        public IActionResult DeleteEnrollment(int Id)
        {
            _enrollmentRepository.DeleteEnrollment(Id);
            return Ok("Enroll Removed Successfully..");
        }
    }
}
