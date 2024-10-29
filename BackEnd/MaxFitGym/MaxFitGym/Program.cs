
using MaxFitGym.DataBase;
using MaxFitGym.IRepository;
using MaxFitGym.Repository;

namespace MaxFitGym
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            var connectionString = builder.Configuration.GetConnectionString("DBConnection");

            ProgramRepository repo = new ProgramRepository(connectionString);
            builder.Services.AddSingleton<IProgramRepository>(provider => new ProgramRepository(connectionString));
            builder.Services.AddSingleton<IMemberRepository>(provider => new MemberRepository(connectionString));
            builder.Services.AddSingleton<IEnrollmentRepository>(provider => new EnrollmentRepository(connectionString , repo));
            builder.Services.AddSingleton<IPaymentRepository>(provider => new PaymentRepository(connectionString));


            //Initialize The Database
            var Initialize = new DatabaseInitializer(connectionString);
            Initialize.Initialize();

            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
                });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseCors();

            app.UseStaticFiles();
            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
