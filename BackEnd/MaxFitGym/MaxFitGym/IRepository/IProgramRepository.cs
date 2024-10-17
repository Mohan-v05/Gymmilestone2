using MaxFitGym.Entities;
using MaxFitGym.Models;

namespace MaxFitGym.IRepository
{
    public interface IProgramRepository
    {
        Programs AddProgram(ProgramDTO programDto);

        ICollection<Programs> GetAllPrograms();

        Programs GetProgramById(Int64 ProgramId);

        void UpdateProgram(int ProgramID, int TotalFee ,string NewName);

        void DeleteProgram(int CourseId);
    }
}
