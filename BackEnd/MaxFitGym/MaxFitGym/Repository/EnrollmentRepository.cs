using MaxFitGym.Entities;
using MaxFitGym.IRepository;
using MaxFitGym.Models.RequestModel;
using MaxFitGym.Models.ResponseModel;
using Microsoft.Data.Sqlite;

namespace MaxFitGym.Repository
{
    public class EnrollmentRepository : IEnrollmentRepository
    {
        private readonly string _connectionString;
        private ProgramRepository _programRepository;

        public EnrollmentRepository(string connectionString, ProgramRepository programRepository)
        {
            _programRepository = programRepository;
            _connectionString = connectionString;
        }

        public async Task<List<Enrollments>> AddEnrollment(EnrollReqDTO enrollReqDTO)
        {

            List<Enrollments> Enrollments = new List<Enrollments>();
            foreach (var item in enrollReqDTO.ProgramId)
            {
                {
                    var program = _programRepository.GetProgramById(item);
                    if (program != null)
                    {
                        using (var connection = new SqliteConnection(_connectionString))
                        {
                            connection.Open();
                            var command = connection.CreateCommand();
                            command.CommandText = @"
            INSERT INTO Enrollment (ProgramId, MemberId, EnrollDate) 
            VALUES (@programId, @memberId, @EnrollDate);
            SELECT last_insert_rowid();";

                            command.Parameters.AddWithValue("@programId", program.Id);
                            command.Parameters.AddWithValue("@memberId", enrollReqDTO.MemberId);
                            command.Parameters.AddWithValue("@EnrollDate", DateTime.Now); // Fixed parameter name

                            var id = (long)command.ExecuteScalar();

                            var Enrollment = new Enrollments
                            {
                                Id = id,
                                programId = program.Id,
                                memberId = enrollReqDTO.MemberId,
                                EnrollDate = DateTime.Now
                            };
                            Enrollments.Add(Enrollment);
                        }
                    }
                    else
                    {
                        throw new Exception("Program Not found");
                    }
                }
                
            }
            return Enrollments;
        }

            public ICollection<EnrollmentResponseDTO> GetAllEnrollments()
            {
                var EnrollmentsList = new List<EnrollmentResponseDTO>();

                using (var connection = new SqliteConnection(_connectionString))
                {
                    connection.Open();
                    var command = connection.CreateCommand();
                    command.CommandText = "SELECT Id,ProgramId,MemberId,EnrollDate FROM Enrollment";
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            EnrollmentsList.Add(new EnrollmentResponseDTO()
                            {
                                Id = reader.GetInt64(0),
                                programId = reader.GetInt64(1),
                                memberId = reader.GetInt64(2),
                                EnrollDate = reader.GetDateTime(3).Date,

                            });
                        }
                    }

                }
                return EnrollmentsList;
            }

            public EnrollmentResponseDTO GetEnrollmentById(Int64 Id)

            {
                using (var connection = new SqliteConnection(_connectionString))
                {
                    connection.Open();
                    var command = connection.CreateCommand();
                    command.CommandText = "SELECT * FROM Enrollment WHERE Id == @id";
                    command.Parameters.AddWithValue("@id", Id);
                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new EnrollmentResponseDTO()
                            {
                                Id = reader.GetInt64(0),
                                programId = reader.GetInt64(1),
                                memberId = reader.GetInt64(2),
                                EnrollDate = reader.GetDateTime(3),
                            };
                        }
                        else
                        {
                            throw new Exception("No such Enrolls!");
                        }
                    };
                };
                return null;
            }

            public void DeleteEnrollment(Int64 Id)
            {
                using (var connection = new SqliteConnection(_connectionString))
                {
                    connection.Open();
                    var command = connection.CreateCommand();
                    command.CommandText = "DELETE FROM Enrollment WHERE Id == @id";
                    command.Parameters.AddWithValue("@id", Id);
                    command.ExecuteNonQuery();
                }
            }
            public List<long> GetEntrolledProgramsByMemberId(Int64 Id)
            {
                List<Int64> programsIds = new List<Int64>();
                using (var connection = new SqliteConnection(_connectionString))
                {
                    connection.Open();
                    var command = connection.CreateCommand();
                    command.CommandText = "Select ProgramId From Enrollment Where MemberId = @Id";
                    command.Parameters.AddWithValue("@Id", Id);



                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var id = reader.GetInt64(0);

                            programsIds.Add(id);
                        }


                    }
                    return programsIds;
                }
            }
        }
    }
