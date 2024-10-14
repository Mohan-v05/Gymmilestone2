namespace MaxFitGym.Models.RequestModel
{
    public class MemberRegisterRequestDTO
    {
    
        public string Nic { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
       public string password { get; set; }
        public DateTime DOB { get; set; }
        public string ContactNumber { get; set; }
        public string Email { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public int Height { get; set; }
        public int Weight { get; set; }
        public DateTime CreationDate { get; set; }
        public bool MemberStatus { get; set; }
    }
}
