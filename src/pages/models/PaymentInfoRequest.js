class PaymentInfoRequest {
    amount;
    currency;
    userEmail;

    constructor(amount, currency, userEmail){
        this.amount = amount;
        this.currency = currency;
        this.userEmail = userEmail;
    }

}

export default PaymentInfoRequest;