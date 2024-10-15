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
                        
                        ProgramName NVARCHAR(25) NOT NULL,
                        Type NVARCHAR(25) NOT NULL,
                        TotalFee INT NOT NULL
                    );   

                    CREATE TABLE IF NOT EXISTS MembersDetails(
                      
                        Nic NVARCHAR(12) NOT NULL,
                        FirstName NVARCHAR(50) NOT NULL,
                        LastName NVARCHAR(50) NOT NULL,
                        Password NVARCHAR(50) NOT NULL,
                        DOB DATE NOT NULL,
                        ContactNumber NVARCHAR(50) NOT NULL,
                        Email NVARCHAR(50) NOT NULL,
                        Age INT NOT NULL,
                        Gender NVARCHAR(50) NOT NULL,
                        Height INT NOT NULL,
                        Weight INT NOT NULL,
                        CreationDate DATE NOT NULL,
                        MemberStatus BOOLEAN NOT NULL
                    );

                      CREATE TABLE IF NOT EXISTS Enrollment (
                     
                      ProgramId INT,
                      MemberId Int,
                      SubscriptionType NVARCHAR(25) NOT NULL,
                      FOREIGN KEY (ProgramId) REFERENCES Program(rowid) ON DELETE CASCADE
                      FOREIGN KEY (MemberId) REFERENCES MembersDetails(rowid) ON DELETE CASCADE
                      );


                ";
                command.ExecuteNonQuery();
        }

    }
}
}