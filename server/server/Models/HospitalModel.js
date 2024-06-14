import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const HospitalSchema = mongoose.Schema({
  hospital_id: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified_otp_time:{
    type:Number,
    required:true
}
}); 

HospitalSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Hospital = mongoose.model('Hospital', HospitalSchema, 'hospitals'); // 'hospitals' is the collection name
export default Hospital;
