const soap = require('soap');
const { parseString } = require('xml2js');

// Function to fetch data from SOAP API
const fetchSOAPData = async () => {
    const url = 'https://fmt.slt.com.lk/fmt/wclogin.asmx';
    const params = {}; // Add your SOAP parameters here.

    return new Promise((resolve, reject) => {
        soap.createClient(url, (err, client) => {
            if (err) {
                console.error('Error creating SOAP client:', err);
                reject(err);
                return;
            }

            client.SomeSOAPMethod(params, (err, result) => {
                if (err) {
                    console.error('SOAP request error:', err);
                    reject(err);
                    return;
                }

                const rawXML = result.someResultField; // Replace with actual field name.
                parseString(rawXML, (err, parsedJSON) => {
                    if (err) {
                        console.error('Error parsing XML:', err);
                        reject(err);
                        return;
                    }

                    resolve(parsedJSON); // Return the parsed data
                });
            });
        });
    });
};

module.exports = fetchSOAPData;
