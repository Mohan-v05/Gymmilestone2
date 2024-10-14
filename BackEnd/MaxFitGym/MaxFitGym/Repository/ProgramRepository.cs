using MaxFitGym.Entities;
using MaxFitGym.IRepository;
using MaxFitGym.Models;
using Microsoft.Data.Sqlite;
using SQLitePCL;
using System;

namespace MaxFitGym.Repository
{
    public class ProgramRepository: IProgramRepository
    {
        private readonly string _connectionString;

        public ProgramRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public Programs AddProgram(ProgramDTO programDto)
        {
            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();
                var command = connection.CreateCommand();
                command = connection.CreateCommand();
                command.CommandText = "INSERT INTO Programs (ProgramName,Type,TotalFee) VALUES (@programName,@type,@totalFee);select last_insert_rowid()";
                command.Parameters.AddWithValue("@programName", programDto.ProgramName);
                command.Parameters.AddWithValue("@type", programDto.Type);
                command.Parameters.AddWithValue("@totalFee", programDto.TotalFee);
                command.ExecuteNonQuery();


                // Execute the command and get the last inserted row ID
                var id = (long)command.ExecuteScalar();

                // Create a new Programs object and set its Id
                Programs programs = new Programs
                {
                    Id = id,
                    ProgramName = programDto.ProgramName,
                    type = programDto.Type,
                    TotalFee = programDto.TotalFee
                };

                return programs; // return the newly created Programs object
            }
        }
         public ICollection<Programs> GetAllPrograms()
        {
            var ProgramList = new List<Programs>();
            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = "SELECT rowid,ProgramName,Type,TotalFee FROM Programs";
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        ProgramList.Add(new Programs()
                        {
                            Id = reader.GetInt32(0),
                            ProgramName = reader.GetString(1),
                            type = reader.GetString(2),
                            TotalFee = reader.GetInt32(3)
                        });
                    }
                }
            }
            return ProgramList;

        }

        public Programs GetProgramById(int ProgramId)
        {
            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = "SELECT * FROM Programs WHERE Id == @id";
                command.Parameters.AddWithValue("@id", ProgramId);
                using (var reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return new Programs()
                        {
                            Id = reader.GetInt32(0),
                            ProgramName = reader.GetString(1),
                            type = reader.GetString(2),
                            TotalFee = reader.GetInt32(3)
                        };
                    }
                    else
                    {
                        throw new Exception("Program Not Found!");
                    }
                };
            };
            return null;
        }

        public void UpdateProgram(int ProgramID, int TotalFee)
        {

            if (TotalFee >= 0)
            {
                using (var connection = new SqliteConnection(_connectionString))
                {
                    connection.Open();
                    var command = connection.CreateCommand();
                    command.CommandText = "UPDATE Programs SET TotalFee = @totalFee  WHERE Id == @id";
                    command.Parameters.AddWithValue("@id", ProgramID);
                    command.Parameters.AddWithValue("@totalFee", TotalFee);
                    command.ExecuteNonQuery();
                }
            }
            else
            {
                throw new Exception("Fee is shoud be Positive Number.");
            }

        }


        public void DeleteProgram(int ProgramId)
        {
            var course = GetProgramById(ProgramId);
            if (course != null)
            {
                using (var connection = new SqliteConnection(_connectionString))
                {
                    connection.Open();
                    var command = connection.CreateCommand();
                    command.CommandText = "DELETE FROM Programs WHERE Id = @id";
                    command.Parameters.AddWithValue("@id", ProgramId);
                    command.ExecuteNonQuery();
                }
            }
            else
            {
                throw new Exception("Program Not Found");
            }

        }

    }
}
