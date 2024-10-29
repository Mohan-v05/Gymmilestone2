using MaxFitGym.Entities;
using MaxFitGym.IRepository;
using MaxFitGym.Models.RequestModel;
using MaxFitGym.Models.ResponseModel;
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
        private readonly IProgramRepository _programRepository;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public EntrollmentController(IEnrollmentRepository enrollmentRepository, IWebHostEnvironment webHostEnvironment, IProgramRepository programRepository)
        {
            _enrollmentRepository = enrollmentRepository;
            _webHostEnvironment = webHostEnvironment;
            _programRepository = programRepository;
        }

        [HttpPost("Add-Enrollment")]
        public IActionResult AddEnrollment( EnrollReqDTO enrollReqDTO)
        {
            try
            {
                var data = _enrollmentRepository.AddEnrollment(enrollReqDTO);
                return Ok(data);
            }
            catch (Exception ex) {
                return BadRequest(ex.Message);
            }
       
        }

        [HttpGet("Get-All-Enrollment")]
        public IActionResult GetAllEnrollments()
        {
            var EnrollList = _enrollmentRepository.GetAllEnrollments();
            return Ok(EnrollList);
        }

        [HttpGet("Get-Enrollment-By-ID/{Id}")]
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


        //GetEntrolledProgramsByMemberId
        [HttpGet("Get-Entrolled-Programs-By-MemberId/{Id}")]
        public IActionResult GetEntrolledProgramsByMemberId(Int64 Id)
        {
            List<Programs> entrolledProgramsResponses = new List<Programs>();

            var programIds = _enrollmentRepository.GetEntrolledProgramsByMemberId(Id);
            foreach (var programId in programIds)
            {
               var program= _programRepository.GetProgramById(programId);

                entrolledProgramsResponses.Add(program);
            }
            return Ok(entrolledProgramsResponses);
        }

      
    }
}
