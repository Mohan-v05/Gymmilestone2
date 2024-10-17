namespace MaxFitGym.Models.RequestModel
{
    public class MemberUpdateRequestDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DOB { get; set; }
        public string ContactNumber { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }

        public int Age { get; set; }
        public string Gender { get; set; }
        public int Height { get; set; }
        public int Weight { get; set; }
        public string Membershiptype { get; set; }
        public int fee { get; set; }
    }
}
