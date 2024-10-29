using MaxFitGym.IRepository;
using MaxFitGym.Models.RequestModel;
using MaxFitGym.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MaxFitGym.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public PaymentController(IPaymentRepository paymentRepository, IWebHostEnvironment webHostEnvironment)
        {
            _paymentRepository = paymentRepository;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost("Add-Payment")]
        public IActionResult AddPayment( PaymentRequestDTO paymentRequestDTO)
        {
            var data = _paymentRepository.AddPayment(paymentRequestDTO);
            return Ok(data);
        }


        [HttpGet("Get-All-Payment")]
        public IActionResult GetAllPayments()
        {
            var PaymentList = _paymentRepository.GetAllPayments();
            return Ok(PaymentList);
        }

        [HttpGet("Get-Payment-By-ID/{memberId}")]
        public IActionResult GetPaymentsByMemberId(Int64 memberId)
        {
            try
            {
                var Payment = _paymentRepository.GetPaymentsByMemberId(memberId);
                return Ok(Payment);
            }

            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
