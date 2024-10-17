namespace MaxFitGym.Models.ResponseModel
{
    public class MemberResponseDTO
    {
        public long Id { get; set; }
        public string Nic { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string password { get; set; }
        public DateTime DOB { get; set; }
        public string ContactNumber { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }

        public int Age { get; set; }
        public string Gender { get; set; }
        public int Height { get; set; }
        public int Weight { get; set; }
        public DateTime CreationDate { get; set; }
        public bool is_initalfeePaid { get; set; }
        public string Membershiptype { get; set; }
        public int fee { get; set; }


    
    }
}
