const otpGenerator = require('otp-generator');
const { OTP_LENGTH, OTP_CONFIG } = require('../constants/constants');

const generateOTP = () => {
    const OTP = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG);
    return OTP;
};

module.exports = generateOTP;