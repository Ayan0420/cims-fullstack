db.ctjomlegacies.aggregate([
    {
      $group: {
        _id: {
          cusName: "$cus_name",
          cusAddress: "$cus_address",
          cusPhone: "$cus_phone"
        }
      }
    },
    {
      $project: {
        _id: "$$REMOVE", // Remove the existing _id to allow MongoDB to generate a new ObjectId
        cusName: "$_id.cusName",
        cusAddress: "$_id.cusAddress",
        cusPhones: [{ $cond: [{ $ne: ["$_id.cusPhone", ""] }, "$_id.cusPhone", null] }],
        cusEmails: [],
        jobOrders: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    },
    {
      $merge: {
        into: "customers",
        whenMatched: "merge",
        whenNotMatched: "insert"
      }
    }
  ]);

  
  db.ctjomlegacies.find().forEach(doc => {
    // Find the customer by name, address, and phone
    const customer = db.customers.findOne({
      cusName: doc.cus_name,
      cusAddress: doc.cus_address,
      cusPhones: { $in: [doc.cus_phone] }
    });
  
    if (customer) {
      // Insert the job order with a reference to the customer ID
      const jobId = db.jobs.insertOne({
        customerId: customer._id,
        jobDate: doc.job_date,
        unitModel: doc.unit_model,
        unitSpecs: doc.unit_specs,
        unitAccessories: doc.unit_accessories,
        workPerformed: doc.work_perf,
        sCharge: doc.s_charge,
        sPayMeth: [doc.s_paymeth],
        sDownPayment: doc.s_downpay,
        sBalance: doc.s_bal,
        sStatus: [doc.s_status],
        sUnitDropOff: !!doc.p_unit_do,
        sRelDate: doc.p_rel_date || "",
        notes: "",
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        jobOrderNum: doc.job_id,
        trackingCode: doc.tracking_code
      }).insertedId;
  
      // Update the customer with the job reference
      db.customers.updateOne(
        { _id: customer._id },
        { $addToSet: { jobOrders: jobId } }
      );
    }
  });



  // Fix for 0023 years

  // to check
  db.jobs.aggregate([
    {
      $addFields: {
        computedYear: {
          $year: {
            $dateFromString: {
              dateString: "$jobDate",
              format: "%Y-%m-%d",
              onError: null,
              onNull: null
            }
          }
        }
      }
    },
    {
      $match: { computedYear: 23 }
    }
  ])

  // fix
db.jobs.updateMany(
  { jobDate: { $regex: /^00\d{2}-\d{2}-\d{2}$/ } },
  [
    {
      $set: {
        jobDate: {
          $concat: [
            "20",                              // Replace "00" with "20"
            { $substrCP: [ "$jobDate", 2, 2 ] }, // Get the next two digits (e.g., "23")
            "-",
            { $substrCP: [ "$jobDate", 5, 2 ] }, // Extract month
            "-",
            { $substrCP: [ "$jobDate", 8, 2 ] }  // Extract day
          ]
        }
      }
    }
  ]
)