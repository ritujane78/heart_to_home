class PaymentInfoRequest {
    amount;
    currency;
    receiptEmail;

    constructor(amount, currency, receiptEmail){
        this.amount = amount;
        this.currency = currency;
        this.receiptEmail = receiptEmail;
    }

}

export default PaymentInfoRequest;