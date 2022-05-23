// Imports
const cds = require("@sap/cds");

/**
   * The service implementation with all service handlers
   */
module.exports = cds.service.impl(async function () {
   // Define constants for the Risk and BusinessPartners entities from the risk-service.cds file
   const { Risks, BusinessPartners } = this.entities;

   /**
   * Set criticality after a READ operation on /risks
   */
    this.after("READ", Risks, (data) => {
       const risks = Array.isArray(data) ? data : [data];

       risks.forEach((risk) => {
         if (risk.impact >= 100000) {
           risk.criticality = 1;
         } else { 
           risk.criticality = 2;
         }
      });
   });

   
cds.serve('inventory-service') .with (function(){
    this.after('READ', '*', (devices)=>{
      for (let each of devices) {
        var deviceAge = calculateDeviceAgeYears(each)
        if (deviceAge >= 4) {
          each.eligible_for_replacement = true
        } else {
          each.eligible_for_replacement = false
        }
      }
    })
  })

/**
   * throw a new error with: throw new Error('something bad happened');
   **/
  this.on("error",(err,req)=>{
    switch(err.message){
      case"UNIQUE_CONSTRAINT_VIOLATION":
        err.message="The entry already exists.";
        break;

      default:
        err.message=
          "An error occured. Please retry. Technical error message: "+
          err.message;
      break;
    }
  });



  this.on("submitOrder",async(req)=>{
    const{ book, amount }=req.data;
    let{ stock }=awaitdb.read(Books,book,(b)=>b.stock);
    if(stock >= amount){
      awaitdb.update(Books,book).with({stock: (stock-=amount)});
      awaitthis.emit("OrderedBook",{ book, amount,buyer: req.user.id});
      returnreq.reply({ stock });// <-- Normal reply
    }else{
      // Reply with error code 409 and a custom error message
      returnreq.error(409,`${amount} exceeds stock for book #${book}`);
    }
  });
  

});