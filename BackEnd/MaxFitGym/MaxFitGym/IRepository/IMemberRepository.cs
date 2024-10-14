using MaxFitGym.Models.RequestModel;
using MaxFitGym.Models.ResponseModel;

namespace MaxFitGym.IRepository
{
    public interface IMemberRepository
    {
        Task<ICollection<MemberResponseDTO>> GetAllMembers();
        void AddMember(MemberRegisterRequestDTO memberRegister);
        void DeleteMember(string memberId);
        void UpdateMember(string memberId, MemberUpdateRequestDTO memberUpdate);
        MemberResponseDTO GetmemberById(string MemberID);
    }
}
