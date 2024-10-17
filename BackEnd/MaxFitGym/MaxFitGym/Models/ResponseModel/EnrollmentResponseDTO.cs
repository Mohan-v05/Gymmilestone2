namespace MaxFitGym.Models.ResponseModel
{
    public class EnrollmentResponseDTO
    {
        public Int64 Id { get; set; }
        public long memberId { get; set; }
        public long programId { get; set; }
        public DateTime EnrollDate { get; set; }
    }
}
