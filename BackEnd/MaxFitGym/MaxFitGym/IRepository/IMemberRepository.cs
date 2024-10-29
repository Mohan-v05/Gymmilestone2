using MaxFitGym.Models.RequestModel;
using MaxFitGym.Models.ResponseModel;

namespace MaxFitGym.IRepository
{
    public interface IMemberRepository
    {
        ICollection <MemberResponseDTO> GetAllMembers();
        MemberResponseDTO AddMember(MemberRegisterRequestDTO memberRegister);
        void DeleteMember(int memberId);
        void UpdateMember(int memberId, MemberUpdateRequestDTO memberUpdate);
        MemberResponseDTO GetmemberById(int MemberID);
    }
}
