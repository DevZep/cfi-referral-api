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
    textBody = `ឈ្មោះ / Name: ${referral.name}\nលេខទូរស័ព្ទ / Phone: ${referral.phone}\nចំណាំ / Note: ${referral.note}\nថ្ងៃ ខែ ឆ្នាំកំណើត / DOB: ${referral.dob}\nភេទ / Gender: ${referral.gender}\nចំណាត់ថ្នាក់ទីតាំង / Location: ${referral.location}\nLat: ${referral.lat}\nLon: ${referral.lon}`;
  } else {
    textBody = `ការបញ្ជុនមិនត្រូវបានឃើញ!សូមស្វែងរកការគាំទ្រ / Referral ${id} Not Found. Please Contact Support.`;
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
          <h3>ទម្រង់បញ្ជូន / There is a new referral</h3>
          <ul>
            <li>ឈ្មោះ / Name: ${referral.name}</li>
            <li>លេខទូរស័ព្ទ / Phone: ${referral.phone}</li>
            <li>ចំណាំ / Note: ${referral.note}</li>
            <li>ថ្ងៃ ខែ ឆ្នាំកំណើត / DOB: ${referral.dob}</li>
            <li>ភេទ / Gender: ${referral.gender}</li>
            <li>ចំណាត់ថ្នាក់ទីតាំង / Location Classification: ${referral.location}</li>
          </ul>`;

    // If the org uses OSCaR then render the import case link here
    // Else render out the link to the OSCaR website homepage!
    if(!referral.oscarSubdomain == '') {
      htmlBody = `${htmlBody}
      <p>បើកOSCaR / Open OSCaR
        <a href='https://${referral.oscarSubdomain}.${oscarDomain}/clients/new?name=${referral.name}&client_phone=${referral.phone}&date_of_birth=${referral.dob}&gender=${gender}'>OSCaR</a>
      </p>`;
    } else {
      htmlBody = `${htmlBody}
      <p>បើមិនកំពុងប្រើOSCaR? សូមពិនិត្យនៅទីនេះ / Not using OSCaR? Check it out here:
        <a href='https://${oscarDomain}/'>OSCaR</a>
      </p>`;
    }

    // If a lat and lon value are available then include a link to a map
    if(referral.lat && referral.lon) {
      htmlBody = `${htmlBody}
      <p>បើកទីតាំងនៅលើផែនទី / Open Location on
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
