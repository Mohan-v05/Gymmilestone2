﻿using MaxFitGym.Models.RequestModel;
using MaxFitGym.Models.ResponseModel;

namespace MaxFitGym.IRepository
{
    public interface IPaymentRepository
    {
        PaymentResponseDTO AddPayment(PaymentRequestDTO paymentRequestDTO);
        Task<ICollection<PaymentResponseDTO>> GetAllPayments();
    }
}
