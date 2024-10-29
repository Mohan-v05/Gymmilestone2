using MaxFitGym.Entities;
using MaxFitGym.IRepository;
using MaxFitGym.Models.RequestModel;
using MaxFitGym.Models.ResponseModel;
using Microsoft.Data.Sqlite;
using System.Data;

namespace MaxFitGym.Repository
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly string _connectionString;

        public PaymentRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public PaymentResponseDTO AddPayment(PaymentRequestDTO paymentRequestDTO)
        {
            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = @"
            INSERT INTO Payments (MemberId,PaidDate,Amount) 
            VALUES (@MemberId, @PaidDate,@Amount);
            SELECT last_insert_rowid();";

                command.Parameters.AddWithValue("@MemberId", paymentRequestDTO.MemberId);
                command.Parameters.AddWithValue("@PaidDate", paymentRequestDTO.PaidDate);
                command.Parameters.AddWithValue("@Amount", paymentRequestDTO.Amount); // Fixed parameter name

                var id = (long)command.ExecuteScalar();

                PaymentResponseDTO responseDTO = new PaymentResponseDTO
                {
                    Id = id,
                    MemberId = paymentRequestDTO.MemberId,
                    PaidDate = paymentRequestDTO.PaidDate,
                    Amount = paymentRequestDTO.Amount
                };

                return responseDTO;
            }
        }

        public ICollection<PaymentResponseDTO> GetAllPayments()
        {
            var PaymentList = new List<PaymentResponseDTO>();

            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = "SELECT Id,MemberId,PaidDate,Amount FROM Payments ";
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        PaymentList.Add(new PaymentResponseDTO()
                        {
                            Id = reader.GetInt64(0),
                            MemberId = reader.GetInt64(1),
                            PaidDate = reader.GetDateTime(2),
                            Amount = reader.GetInt64(3),

                        });
                    }
                }

            }
            return PaymentList;
        }

        
        public PaymentResponseDTO GetPaymentsByMemberId(Int64 memberId)
        {
            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = "SELECT * FROM Payments WHERE MemberId == @memberId";
                command.Parameters.AddWithValue("@memberId", memberId);
                using (var reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return new PaymentResponseDTO()
                        {
                            Id = reader.GetInt32(0),
                            MemberId = reader.GetInt64(1),
                            PaidDate = reader.GetDateTime(2),
                            Amount = reader.GetInt64(3),
                        };
                    }
                    else
                    {
                        throw new Exception(" No Such Payments Process!");
                    }
                };
            };
            return null;
        }

    }
}
