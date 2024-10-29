namespace MaxFitGym.Entities
{
    public class Enrollments
    {
        public Int64 Id { get; set; }
        public Int64 programId { get; set; }
        public Int64 memberId { get; set; }        
        public DateTime EnrollDate { get; set; }
    }
}
