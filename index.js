const axios = require("axios");
const ObjectsToCsv = require("objects-to-csv");

const azScraper = async (id, count) => {
  const results = [];

  for (let i = 0; i <= count; i++) {
    console.log(i);
    try {
      const res = await axios.get(
        `https://roc.az.gov/online-services?ff=contractorSearchResults&searchfor=${id}`
      );

      const {
        Name,
        Email__c,
        Phone,
        ROC_Zip_Postal_Code__c,
        Licenses__r,
      } = res.data[0];

      const data = {
        lic: id,
        lic_type: Licenses__r.records[0].license_subtype__c || "n/a",
        businessName: Name || "n/a",
        email: Email__c || "n/a",
        phoneNumber: Phone || "n/a",
        zip: ROC_Zip_Postal_Code__c || "n/a",
      };

      results.push(data);
    } catch (err) {
      console.log(err.data);
    }

    id++;
    continue;
  }

  const csv = new ObjectsToCsv(results);

  await csv.toDisk("./output.csv");
  console.log(await csv.toString());
};

azScraper(329604, 1000);
