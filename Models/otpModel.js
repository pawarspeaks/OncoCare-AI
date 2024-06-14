import mongoose from 'mongoose';

const otpSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    otpvalue: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '10m',  // expires in 10 minutes
    },
}, {
    timestamps: true,
});

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;
