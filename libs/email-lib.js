export {
  checkWhitelist,
  renderText,
  renderHtml,
  convertToLowerAndUnderscore
};

function checkWhitelist(whitelist, orgemail) {
  if(!whitelist.includes(orgemail)) { throw({message: `Email ${orgemail} not whitelisted`}); };
  return true;
}

function renderText(id, referral) {
  let textBody;
  if(referral) {
    textBody = `Name: ${referral.name}\nPhone: ${referral.phone}\nNote: ${referral.note}\nDOB: ${referral.dob}\nGender: ${referral.gender}\nLocation: ${referral.location}\nLat: ${referral.lat}\nLon: ${referral.lon}`;
  } else {
    textBody = `Referral ${id} Not Found. Please Contact Support.`;
  }
  return textBody;
}

function convertToLowerAndUnderscore(text) {
  return text.toLowerCase().replace(/ /g, '_');
}

function renderHtml(id, referral, oscarDomain) {
  let htmlBody;
  if (referral) {
    // convert gender to lower case with underscores
    let gender = convertToLowerAndUnderscore(referral.gender);
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
          </ul>`;

    // If the org uses OSCaR then render the import case link here
    // Else render out the link to the OSCaR website homepage!
    if(!referral.oscarSubdomain == '') {
      htmlBody = `${htmlBody}
      <p>Open OSCaR
        <a href='https://${referral.oscarSubdomain}.${oscarDomain}/clients/new?name=${referral.name}&client_phone=${referral.phone}&date_of_birth=${referral.dob}&gender=${gender}'>OSCaR</a>
      </p>`;
    } else {
      htmlBody = `${htmlBody}
      <p>Not using OSCaR? Check it out here:
        <a href='https://${oscarDomain}/'>OSCaR</a>
      </p>`;
    }

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
