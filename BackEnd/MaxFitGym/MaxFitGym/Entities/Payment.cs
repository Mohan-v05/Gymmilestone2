namespace MaxFitGym.Entities
{
    public class Payment
    {
        public Int64 Id { get; set; }
        public Int64 MemberId { get; set; }
        public DateTime PaidDate { get; set; }
        public Int64 Amount { get; set; }


    }
}
