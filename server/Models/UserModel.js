import mongoose from 'mongoose';
const { Schema } = mongoose;

const diseaseStateSchema = new Schema({
  state: { type: String, required: true },
  startDate: { type: String, required: false },
  endDate: { type: String }
}, { _id: false });

const procedureSchema = new Schema({
  date: { type: String, required: false },
  type: { type: String, required: true },
  description: { type: String, required: false }
}, { _id: false });

const treatmentSchema = new Schema({
  type: { type: String, required: true },
  startDate: { type: String, required: false },
  endDate: { type: String },
  description: { type: String, required: false }
}, { _id: false });

const labResultSchema = new Schema({
  date: { type: String, required: false },
  test: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true }
}, { _id: false });

const imagingStudySchema = new Schema({
  date: { type: String, required: false },
  type: { type: String, required: true },
  findings: { type: String, required: true }
}, { _id: false });

const medicationSchema = new Schema({
  name: { type: String, required: true },
  startDate: { type: String, required: false },
  endDate: { type: String },
  dosage: { type: String, required: false }
}, { _id: false });

const patientDetailsSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  cancerType: { type: String, required: true },
  diagnosisDate: { type: String, required: false },
  gleason_score: { type: Number, required: true },
  pathologicStage: { type: String, required: true },
  comorbidities: [{ type: String, required: true }],
  diseaseStates: [diseaseStateSchema],
  procedures: [procedureSchema],
  treatments: [treatmentSchema], // Ensure consistency in naming here
  labResults: [labResultSchema],
  imagingStudies: [imagingStudySchema],
  medications: [medicationSchema]
}, { _id: false });

const userSchema = new Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  doctorId: { type: String, required: true },
  hospital_id: { type: String, required: true },
  patientDetails: patientDetailsSchema
});

// Middleware to remove unwanted _id fields from nested objects
userSchema.pre('save', function(next) {
  const doc = this.toObject();

  // Remove _id from nested diseaseStates
  if (doc.patientDetails && doc.patientDetails.diseaseStates) {
    doc.patientDetails.diseaseStates.forEach(state => {
      if (state._id) delete state._id;
    });
  }

  // Remove _id from nested procedures
  if (doc.patientDetails && doc.patientDetails.procedures) {
    doc.patientDetails.procedures.forEach(procedure => {
      if (procedure._id) delete procedure._id;
    });
  }

  // Remove _id from nested treatments (ensure consistency in naming)
  if (doc.patientDetails && doc.patientDetails.treatments) {
    doc.patientDetails.treatments.forEach(treatment => {
      if (treatment._id) delete treatment._id;
    });
  }

  // Remove _id from nested labResults
  if (doc.patientDetails && doc.patientDetails.labResults) {
    doc.patientDetails.labResults.forEach(labResult => {
      if (labResult._id) delete labResult._id;
    });
  }

  // Remove _id from nested imagingStudies
  if (doc.patientDetails && doc.patientDetails.imagingStudies) {
    doc.patientDetails.imagingStudies.forEach(imagingStudy => {
      if (imagingStudy._id) delete imagingStudy._id;
    });
  }

  // Remove _id from nested medications
  if (doc.patientDetails && doc.patientDetails.medications) {
    doc.patientDetails.medications.forEach(medication => {
      if (medication._id) delete medication._id;
    });
  }

  next();
});

const User = mongoose.model('User', userSchema, 'patients'); // 'patients' is the collection name

export default User;

// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const { Schema } = mongoose;

// const userSchema = new Schema({
//   userId: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   doctorId: {
//     type: String,
//     required: true,
//   },
//   hospital_id: {
//     type: String,
//     required: true,
//   },
//   patientDetails: {
//     type: {
//       name: {
//         type: String,
//         required: true,
//       },
//       age: {
//         type: Number,
//         required: true,
//       },
//       gender: {
//         type: String,
//         required: true,
//       },
//       cancerType: {
//         type: String,
//         required: true,
//       },
//       diagnosisDate: {
//         type: String,
//         required: true,
//       },
//       gleason_score: {
//         type: Number,
//         required: true,
//       },
//       pathologicStage: {
//         type: String,
//         required: true,
//       },
//       comorbidities: {
//         type: [String],
//         required: true,
//       },
//       diseaseStates: {
//         type: [
//           {
//             state: {
//               type: String,
//               required: true,
//             },
//             startDate: {
//               type: String,
//               required: true,
//             },
//             endDate: {
//               type: String,
//             },
//           },
//         ],
//         required: true,
//       },
//       procedures: {
//         type: [
//           {
//             date: {
//               type: String,
//               required: true,
//             },
//             type: {
//               type: String,
//               required: true,
//             },
//             description: {
//               type: String,
//               required: true,
//             },
//           },
//         ],
//         required: true,
//       },
//       treatment: {
//         type: [
//           {
//             type: {
//               type: String,
//               required: true,
//             },
//             start_date: {
//               type: String,
//               required: true,
//             },
//             end_date: {
//               type: String,
//             },
//             description: {
//               type: String,
//               required: true,
//             },
//           },
//         ],
//         required: true,
//       },
//       labResults: {
//         type: [
//           {
//             date: {
//               type: String,
//               required: true,
//             },
//             test: {
//               type: String,
//               required: true,
//             },
//             value: {
//               type: Schema.Types.Mixed,
//               required: true,
//             },
//           },
//         ],
//         required: true,
//       },
//       imagingStudies: {
//         type: [
//           {
//             date: {
//               type: String,
//               required: true,
//             },
//             type: {
//               type: String,
//               required: true,
//             },
//             findings: {
//               type: String,
//               required: true,
//             },
//           },
//         ],
//         required: true,
//       },
//       medications: {
//         type: [
//           {
//             name: {
//               type: String,
//               required: true,
//             },
//             start_date: {
//               type: String,
//               required: true,
//             },
//             end_date: {
//               type: String,
//             },
//             dosage: {
//               type: String,
//               required: true,
//             },
//           },
//         ],
//         required: true,
//       },
//     },
//     required: true,
//   },
// });


// userSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// const User = mongoose.model('User', userSchema, 'patients'); // 'patients' is the collection name

// export default User;


