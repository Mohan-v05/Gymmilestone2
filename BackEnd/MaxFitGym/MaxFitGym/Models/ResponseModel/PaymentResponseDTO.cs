namespace MaxFitGym.Models.ResponseModel
{
    public class PaymentResponseDTO
    {
        public Int64 Id { get; set; }
        public Int64 MemberId { get; set; }
        public DateTime PaidDate { get; set; }
        public Int64 Amount { get; set; }
    }
}
