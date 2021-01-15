import * as email from '../libs/email-lib';
let whitelistCSV = 'dev-cfi-referral-app@devzep.com,dev-cfi-referral-app2@devzep.com,darren@devzep.com,damon@devzep.com,seyha@devzep.com,makara@devzep.com'
let id = "d58947f0-e86b-11ea-8456-134c20446fb6"
let notfoundId = "999999999"
let referral = {
  referralId: "d58947f0-e86b-11ea-8456-134c20446fb6",
  name: "A name",
  phone: "0122020202",
  photo: "1598536037983-Image.jpeg",
  createdAt: 1598536042991,
  dob: '1989-09-10',
  gender: 'Prefer not to say',
  location: 'Work',
  note: 'This is a note',
  lat: '11.532296299999999',
  lon: '104.91594169999999',
  oscarSubdomain: 'dc',
  userId: "ap-southeast-1:c342f6d1-7500-41b0-8987-8jdjhr83"
}
let oscarDomain = 'oscarhq-staging.com'

describe('checkWhitelist()', () => {
  describe('when email is in whitelist', () => {
    it('should return true', () => {
      let whitelist = whitelistCSV.split(',')
      email.checkWhitelist(whitelist, 'darren@devzep.com')
    })
    it('should return true', () => {
      let singleEmailWhitelist = ['darren.jensen@gmail.com']
      email.checkWhitelist(singleEmailWhitelist, 'darren.jensen@gmail.com')
    })
  })
  describe('when email is NOT included in the whitelist', () => {
    it('should thow an exception', () => {
      let orgemail = 'notwhitelisted@gmail.com'
      let whitelist = whitelistCSV.split(',')
      expect(() => {
        email.checkWhitelist(whitelist, orgemail)
      }).toThrow(`Email ${orgemail} not whitelisted`);
    })
  })
})

describe('convertToLowerAndUnderscore', () => {
  it('should convert a string to lower case and replace spaces with underscores', () => {
    let inputStr = 'Prefer not to say'
    let expectedOutput = 'prefer_not_to_say'
    expect(email.convertToLowerAndUnderscore(inputStr)).toEqual(expectedOutput)
  })
})

test('renderText() when referral NOT found', () => {
  expect(email.renderText(notfoundId, undefined)).toEqual(`ការបញ្ជុនមិនត្រូវបានឃើញ!សូមស្វែងរកការគាំទ្រ / Referral ${notfoundId} Not Found. Please Contact Support.`)
})

test('renderText() when referral IS found', () => {
  expect(email.renderText(id, referral)).toEqual(`ឈ្មោះ / Name: ${referral.name}\nលេខទូរស័ព្ទ / Phone: ${referral.phone}\nចំណាំ / Note: ${referral.note}\nថ្ងៃ ខែ ឆ្នាំកំណើត / DOB: ${referral.dob}\nភេទ / Gender: ${referral.gender}\nចំណាត់ថ្នាក់ទីតាំង / Location: ${referral.location}\nLat: ${referral.lat}\nLon: ${referral.lon}`)
})

describe('renderHtml()', () => {
  it('should render a not found message when referral NOT found', () => {
    expect(email.renderHtml(notfoundId, undefined, oscarDomain)).toEqual(`<!DOCTYPE html><html><head></head><body><b>ការបញ្ជុនមិនត្រូវបានឃើញ!សូមស្វែងរកការគាំទ្រ / Referral ${notfoundId} Not Found. Please Contact Support.</b></body></html>`)
  })

  it('should render the full email content when referral IS found', () => {
    let gender = email.convertToLowerAndUnderscore(referral.gender)
    expect(email.renderHtml(id, referral, oscarDomain)).toEqual(`
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
          </ul>
      <p>បើកOSCaR / Open OSCaR
        <a href='https://dc.${oscarDomain}/clients/new?name=${referral.name}&client_phone=${referral.phone}&date_of_birth=${referral.dob}&gender=${gender}'>OSCaR</a>
      </p>
      <p>បើកទីតាំងនៅលើផែនទី / Open Location on
        <a href='https://maps.google.com/maps?q=${referral.lat},${referral.lon}'>Map</a>
      </p></body></html>`)
  })

  it('should inlude a link to oscarhq.com home page when oscar subdomain is empty', () => {
    referral.oscarSubdomain = ''
    expect(email.renderHtml(id, referral, oscarDomain)).toEqual(`
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
          </ul>
      <p>បើមិនកំពុងប្រើOSCaR? សូមពិនិត្យនៅទីនេះ / Not using OSCaR? Check it out here:
        <a href='https://${oscarDomain}/'>OSCaR</a>
      </p>
      <p>បើកទីតាំងនៅលើផែនទី / Open Location on
        <a href='https://maps.google.com/maps?q=${referral.lat},${referral.lon}'>Map</a>
      </p></body></html>`)
  })
})

