using MaxFitGym.Entities;
using MaxFitGym.Models;

namespace MaxFitGym.IRepository
{
    public interface IProgramRepository
    {
        ProgramDTO AddProgram(ProgramDTO programDto);
        ICollection<Programs> GetAllPrograms();
        Programs GetProgramById(int ProgramId);

        void UpdateProgram(int ProgramID, int TotalFee);
        void DeleteProgram(int CourseId);
    }
}
