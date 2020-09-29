let oscarDomains = ['demo','dc', 'dc', 'dc', 'dc', 'dc'];

exports.whitelist = [];

export {
  setWhitelist,
  selectOscarSubDomain,
  checkWhitelist,
  renderText,
  renderHtml
};

function setWhitelist(whitelistCSV) {
  this.whitelist = whitelistCSV.split(',');
}

function selectOscarSubDomain(orgemail) {
  return oscarDomains[this.whitelist.indexOf(orgemail)];
}

function checkWhitelist(orgemail) {
  if(!this.whitelist.includes(orgemail)) { throw({message: `Email ${orgemail} not whitelisted`}); };
  return true;
}

function renderText(id, referral, domain) {
  let textBody;
  if(referral) {
    textBody = `Name: ${referral.name}\nPhone: ${referral.phone}\nNote: ${referral.note}\nDOB: ${referral.dob}\nGender: ${referral.gender}\nLocation: ${referral.location}\nLat: ${referral.lat}\nLon: ${referral.lon}`;
  } else {
    textBody = `Referral ${id} Not Found. Please Contact Support.`;
  }
  return textBody;
}

function renderHtml(id, referral, domain) {
  let htmlBody;
  if (referral) {
    // set the html body
    htmlBody = `
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <h3>There is a new referral</h3>
          <ul>
            <li>Name: ${referral.name}</li>
            <li>Phone: ${referral.phone}</li>
            <li>Note: ${referral.note}</li>
            <li>DOB: ${referral.dob}</li>
            <li>Gender: ${referral.gender}</li>
            <li>Location: ${referral.location}</li>
          </ul>
          <p>Open OSCaR
            <a href='http://${domain}.oscarhq-staging.com/clients/new?name=${referral.name}&client_phone=${referral.phone}&date_of_birth=${referral.dob}&gender=${referral.gender}'>OSCaR</a>
          </p>`;

    // If a lat and lon value are available then include a link to a map
    if(referral.lat && referral.lon) {
      htmlBody = `${htmlBody}
      <p>Open Location on
        <a href='https://maps.google.com/maps?q=${referral.lat},${referral.lon}'>Map</a>
      </p>`;
    }

    // Close out the body and html tag
    htmlBody = htmlBody + '</body></html>';
  } else {
    htmlBody = `<!DOCTYPE html><html><head></head><body><b>${renderText(id, referral)}</b></body></html>`;
  }
  return htmlBody;
}
