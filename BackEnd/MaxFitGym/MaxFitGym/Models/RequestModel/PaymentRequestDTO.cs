namespace MaxFitGym.Models.RequestModel
{
    public class PaymentRequestDTO
    {
        public Int64 MemberId { get; set; }
        public DateTime PaidDate { get; set; }
        public Int64 Amount { get; set; }
    }
}
