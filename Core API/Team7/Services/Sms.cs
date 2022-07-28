using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using System;
using Twilio;
using Twilio.Rest.Api.V2010.Account;

namespace Team7.Services
{
    public class Sms
    {

        public void sendSMS(string reciever, string msg)
        {
            string accountSid = "ACe4901ecd9edfc741d4a90409248d8bab";
            string authToken = "94b2c0792c5b6e42562f16e0ebbf91b5";

            TwilioClient.Init(accountSid, authToken);

            var message = MessageResource.Create(
                body: msg,
                from: new Twilio.Types.PhoneNumber("+15135476989"),
                to: new Twilio.Types.PhoneNumber(reciever)
            );

        }

    }
}
