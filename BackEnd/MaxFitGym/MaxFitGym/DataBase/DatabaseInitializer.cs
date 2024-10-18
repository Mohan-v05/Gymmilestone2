using Microsoft.Data.Sqlite;

namespace MaxFitGym.DataBase
{
    public class DatabaseInitializer
    {
        private readonly string _ConnectionString;

        public DatabaseInitializer(string connectionString)
        {
            _ConnectionString = connectionString;
        }


        public void Initialize()
        {
            using (var connection = new SqliteConnection(_ConnectionString))
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = @"
                  
                    CREATE TABLE IF NOT EXISTS  Programs(
                        Id INTEGER PRIMARY KEY AUTOINCREMENT,
                        ProgramName NVARCHAR(25) NOT NULL,
                        Type NVARCHAR(25) NOT NULL,
                        TotalFee INT NOT NULL
                    );   

                    CREATE TABLE IF NOT EXISTS MembersDetails(
                       Id INTEGER PRIMARY KEY AUTOINCREMENT,
                        Nic NVARCHAR(12) NOT NULL,
                        FirstName NVARCHAR(50) NOT NULL,
                        LastName NVARCHAR(50) NOT NULL,
                        Password NVARCHAR(50) NOT NULL,
                        DOB DATE NOT NULL,
                        ContactNumber NVARCHAR(50) NOT NULL,
                        Email NVARCHAR(50) NOT NULL,
                        Address Nvarchar(100) NOT NULL,
                        Age INT NOT NULL,
                        Gender NVARCHAR(50) NOT NULL,
                        Height INT NOT NULL,
                        Weight INT NOT NULL,
                        CreationDate DATE NOT NULL,
                        is_initalfeePaid  BOOLEAN NOT NULL,
                        MembershipType nvarchar(50),
                        Fees decimal not null
                    );

                      CREATE TABLE IF NOT EXISTS Enrollment (
                        Id INTEGER PRIMARY KEY AUTOINCREMENT,
                      ProgramId INT,
                      MemberId int,
                      EnrollDate DATE NOT NULL,
                      FOREIGN KEY (ProgramId) REFERENCES Programs(Id) ON DELETE CASCADE,
                      FOREIGN KEY (MemberId) REFERENCES MembersDetails(Id) ON DELETE CASCADE
                      );

                    CREATE TABLE IF NOT EXISTS Payments (
                        Id INTEGER PRIMARY KEY AUTOINCREMENT,
                      MemberId int,
                      PaidDate DATE NOT NULL,
                      Amount INT,
                      FOREIGN KEY (MemberId) REFERENCES MembersDetails(Id) ON DELETE CASCADE
                      );
                      



                ";
                command.ExecuteNonQuery();
        }

    }
}
}