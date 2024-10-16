using MaxFitGym.IRepository;
using MaxFitGym.Models.RequestModel;
using MaxFitGym.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MaxFitGym.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MemberController : ControllerBase
    {
        private readonly IMemberRepository _memberRepository;
        private readonly IWebHostEnvironment _webHostEnvironment;


        public MemberController(IMemberRepository memberRepository, IWebHostEnvironment webHostEnvironment)
        {
            _memberRepository = memberRepository;
            _webHostEnvironment = webHostEnvironment;
        }

        //add new member
        [HttpPost("Add-Member")]
        public IActionResult AddMembers([FromForm] MemberRegisterRequestDTO memberRegister)
        {
            _memberRepository.AddMember(memberRegister);
            return Ok(memberRegister);
        }


        //Get All Members
        [HttpGet("Get-All-Members")]
        public async Task<IActionResult> GetAllMembers()
        {
            var MembersList = _memberRepository.GetAllMembers();
            return Ok(MembersList);
        }



        // Get member By Id
        [HttpGet("Get-Member-By-ID /{MemberID}")]
        public IActionResult GetmemberById(int MemberID)
        {
            try
            {
                var member = _memberRepository.GetmemberById(MemberID);

                return Ok(member);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpDelete("Delete-Member/{memberId}")]
        public IActionResult DeleteMembers(int memberId)
        {
            _memberRepository.DeleteMember(memberId);
            return Ok("Delete Successfully..");
        }



        [HttpPut("Update-Member/{memberId}")]
        public IActionResult UpdateMember(int memberId, [FromForm]MemberUpdateRequestDTO memberUpdate)
        {
            _memberRepository.UpdateMember(memberId, memberUpdate);
            return Ok("Update Successfully..");
        }


    }
}
