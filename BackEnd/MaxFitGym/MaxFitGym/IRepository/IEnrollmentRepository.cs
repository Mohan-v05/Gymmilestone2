﻿using MaxFitGym.Models.RequestModel;
using MaxFitGym.Models.ResponseModel;

namespace MaxFitGym.IRepository
{
    public interface IEnrollmentRepository
    {
        EnrollmentResponseDTO AddEnrollment(EnrollmentRequestDTO enrollmentRequestDTO);
        Task<ICollection<EnrollmentResponseDTO>> GetAllEnrollments();
        EnrollmentResponseDTO GetEnrollmentById(Int64 Id);
        void DeleteEnrollment(Int64 Id);
        List<EntrolledProgramsResponseDTO> GetEntrolledProgramsByMemberId(Int64 Id);

    }
}
