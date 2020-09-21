import * as email from '../libs/email-lib';
let whitelist = ['email1@gmail.com', 'email2@gmail.com']
let id = "d58947f0-e86b-11ea-8456-134c20446fb6"
let notfoundId = "999999999"
let referral = {
  referralId: "d58947f0-e86b-11ea-8456-134c20446fb6",
  name: "A name",
  phone: "0122020202",
  photo: "1598536037983-Image.jpeg",
  createdAt: 1598536042991,
  dob: '1989-09-10',
  gender: 'Male',
  location: 'Work',
  note: 'This is a note',
  lat: '11.532296299999999',
  lon: '104.91594169999999',
  userId: "ap-southeast-1:c342f6d1-7500-41b0-8987-8jdjhr83"
}

test('selectOscarSubDomain()', () => {
  expect(email.selectOscarSubDomain(whitelist, whitelist[0])).toEqual('demo')
  expect(email.selectOscarSubDomain(whitelist, whitelist[1])).toEqual('dc')
});

test('checkWhitelist()', () => {
  let orgemail = 'notwhitelisted@gmail.com'
  expect(() => {
    email.checkWhitelist(whitelist, 'notwhitelisted@gmail.com')
  }).toThrow(`Email ${orgemail} not whitelisted`);
});

test('renderText() when referral NOT found', () => {
  expect(email.renderText(notfoundId, undefined)).toEqual(`Referral ${notfoundId} Not Found. Please Contact Support.`)
})

test('renderText() when referral IS found', () => {
  expect(email.renderText(id, referral)).toEqual(`Name: ${referral.name}\nPhone: ${referral.phone}\nNote: ${referral.note}\nDOB: ${referral.dob}\nGender: ${referral.gender}\nLocation: ${referral.location}\nLat: ${referral.lat}\nLon: ${referral.lon}`)
})

test('renderHtml() when referral NOT found', () => {
  expect(email.renderHtml(notfoundId, undefined, 'dc')).toEqual(`<!DOCTYPE html><html><head></head><body><b>Referral ${notfoundId} Not Found. Please Contact Support.</b></body></html>`)
})

test('renderHtml() when referral IS found', () => {
  expect(email.renderHtml(id, referral, 'dc')).toEqual(`
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
            <a href='http://dc.oscarhq-staging.com/clients/new'>OSCaR</a>
          </p>
      <p>Open Location on
        <a href='https://maps.google.com/maps?q=${referral.lat},${referral.lon}'>Map</a>
      </p></body></html>`)
})