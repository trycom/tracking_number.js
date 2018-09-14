import test from "ava";
import TrackingNumber from "./src";
const validation = require("./src/utils/validation");

// a tracking number
test("throws error when no provided tracking number", t => {
  t.throws(() => new TrackingNumber());
});

test("return unknown when given invalid number", t => {
  const { valid } = new TrackingNumber("101");
  t.false(valid);
});

test("upcase and remove spaces from tracking number", t => {
  const { trackingNumber } = new TrackingNumber("abc 123 def");
  t.is(trackingNumber, "ABC123DEF");
});

test("remove leading and trailing whitespace from tracking number", t => {
  const { trackingNumber } = new TrackingNumber("  ABC123 \n");
  t.is(trackingNumber, "ABC123");
});

// tracking number additional data for UPS
const upsTrackingNumber = "1Z5R89390357567127";

test("UPS: report correct courier name", t => {
  const { courierName } = new TrackingNumber(upsTrackingNumber);
  t.is(courierName, "UPS");
});

test("UPS: report correct courier code", t => {
  const { courierCode } = new TrackingNumber(upsTrackingNumber);
  t.is(courierCode, "ups");
});

test("UPS: report correct service", t => {
  const { serviceType } = new TrackingNumber(upsTrackingNumber);
  t.is(serviceType, "UPS United States Ground");
});

test("UPS: report correct missing service description", t => {
  const { serviceDescription } = new TrackingNumber(upsTrackingNumber);
  t.falsy(serviceDescription);
});

test("UPS: report correct shipper_id", t => {
  const { shipperId } = new TrackingNumber(upsTrackingNumber);
  t.is(shipperId, "5R8939");
});

test("UPS: report correct no destination", t => {
  const { destinationZip } = new TrackingNumber(upsTrackingNumber);
  t.falsy(destinationZip);
});

test("UPS: report correct no package info", t => {
  const { packageType } = new TrackingNumber(upsTrackingNumber);
  t.falsy(packageType);
});

test("UPS: have valid tracking url", t => {
  const { trackingUrl, trackingNumber } = new TrackingNumber(upsTrackingNumber);
  t.truthy(trackingUrl);
  t.true(trackingUrl.includes(trackingNumber));
});

test("UPS: have valid info", t => {
  const { info, trackingUrl } = new TrackingNumber(upsTrackingNumber);
  t.deepEqual(info, {
    courier: { name: "UPS", courierCode: "ups" },
    destinationZip: undefined,
    packageType: undefined,
    serviceDescription: undefined,
    serviceType: "UPS United States Ground",
    shipperId: "5R8939",
    trackingUrl
  });
});

test("UPS: have valid decode", t => {
  const { decode } = new TrackingNumber(upsTrackingNumber);
  t.deepEqual(decode, {
    CheckDigit: "7",
    SerialNumber: "5R8939035756712",
    ServiceType: "03",
    PackageId: "5756712",
    ShipperId: "5R8939"
  });
});

// tracking number additional data for S10
const s10TrackingNumber = "RB123456785GB";

test("S10: report invalid tracking for none existant country", t => {
  const { valid } = new TrackingNumber("RB123456785XX");
  t.false(valid);
});

test("S10: report correct courier name", t => {
  const { courierName } = new TrackingNumber(s10TrackingNumber);
  t.is(courierName, "Royal Mail Group plc");
});

test("S10: report correct courier code", t => {
  const { courierCode } = new TrackingNumber(s10TrackingNumber);
  t.is(courierCode, "s10");
});

test("S10: report correct service", t => {
  const { serviceType } = new TrackingNumber(s10TrackingNumber);
  t.is(serviceType, "Letter Post Registered");
});

test("S10: report correct service description", t => {
  const { serviceDescription } = new TrackingNumber(s10TrackingNumber);
  t.truthy(serviceDescription);
});

test("S10: report correct shipper_id", t => {
  const { shipperId } = new TrackingNumber(s10TrackingNumber);
  t.falsy(shipperId);
});

test("S10: report correct no destination", t => {
  const { destinationZip } = new TrackingNumber(s10TrackingNumber);
  t.falsy(destinationZip);
});

test("S10: report correct no package info", t => {
  const { packageType } = new TrackingNumber(s10TrackingNumber);
  t.falsy(packageType);
});

test("S10: have no tracking url", t => {
  const { trackingUrl } = new TrackingNumber(s10TrackingNumber);
  t.falsy(trackingUrl);
});

test("S10: have valid info", t => {
  const { info } = new TrackingNumber(s10TrackingNumber);
  t.deepEqual(info, {
    courier: {
      name: "Royal Mail Group plc",
      country: "Great Britain",
      courierCode: "s10",
      upu_reference_url:
        "http://www.upu.int/en/the-upu/member-countries/western-europe/great-britain.html",
      courier_url:
        "http://www.royalmail.com/postcode-finder?gear=postcode&campaignid=postcodefinder_redirect"
    },
    destinationZip: undefined,
    packageType: undefined,
    serviceDescription:
      "Prepaid first-class mail that is recorded by the post office before being sent and at each point along its route to safeguard against loss, theft, or damage.",
    serviceType: "Letter Post Registered",
    shipperId: undefined,
    trackingUrl: undefined
  });
});

test("S10: have valid decode", t => {
  const { decode } = new TrackingNumber(s10TrackingNumber);
  t.deepEqual(decode, {
    CheckDigit: "5",
    CountryCode: "GB",
    SerialNumber: "12345678",
    ServiceType: "RB"
  });
});

// tracking number additional data for USPS 20
const uspsTrackingNumber = "0307 1790 0005 2348 3741";

test("USPS 20: report correct courier name", t => {
  const { courierName } = new TrackingNumber(uspsTrackingNumber);
  t.is(courierName, "United States Postal Service");
});

test("USPS 20: report correct courier code", t => {
  const { courierCode } = new TrackingNumber(uspsTrackingNumber);
  t.is(courierCode, "usps");
});

test("USPS 20: report correct service", t => {
  const { serviceType } = new TrackingNumber(uspsTrackingNumber);
  t.falsy(serviceType);
});

test("USPS 20: report correct missing service description", t => {
  const { serviceDescription } = new TrackingNumber(uspsTrackingNumber);
  t.falsy(serviceDescription);
});

test("USPS 20: report correct shipper_id", t => {
  const { shipperId } = new TrackingNumber(uspsTrackingNumber);
  t.is(shipperId, "071790000");
});

test("USPS 20: report correct no destination", t => {
  const { destinationZip } = new TrackingNumber(uspsTrackingNumber);
  t.falsy(destinationZip);
});

test("USPS 20: report correct no package info", t => {
  const { packageType } = new TrackingNumber(uspsTrackingNumber);
  t.falsy(packageType);
});

test("USPS 20: have valid tracking url", t => {
  const { trackingUrl, trackingNumber } = new TrackingNumber(
    uspsTrackingNumber
  );
  t.truthy(trackingUrl);
  t.true(trackingUrl.includes(trackingNumber));
});

test("USPS 20: have valid info", t => {
  const { info, trackingUrl } = new TrackingNumber(uspsTrackingNumber);
  t.deepEqual(info, {
    courier: { name: "United States Postal Service", courierCode: "usps" },
    shipperId: "071790000",
    trackingUrl,
    destinationZip: undefined,
    packageType: undefined,
    serviceDescription: undefined,
    serviceType: undefined
  });
});

test("USPS 20: have valid decode", t => {
  const { decode } = new TrackingNumber(uspsTrackingNumber);
  t.deepEqual(decode, {
    CheckDigit: "1",
    PackageId: "52348374",
    SerialNumber: "0307179000052348374",
    ShipperId: "071790000",
    ServiceType: "03"
  });
});

// tracking number additional data for USPS 34v2
const usps34v2TrackingNumber = "4201002334249200190132607600833457";

test("USPS 34v2: report correct courier name", t => {
  const { courierName } = new TrackingNumber(usps34v2TrackingNumber);
  t.is(courierName, "United States Postal Service");
});

test("USPS 34v2: report correct courier code", t => {
  const { courierCode } = new TrackingNumber(usps34v2TrackingNumber);
  t.is(courierCode, "usps");
});

test("USPS 34v2: report correct service", t => {
  const { serviceType } = new TrackingNumber(usps34v2TrackingNumber);
  t.falsy(serviceType);
});

test("USPS 34v2: report correct missing service description", t => {
  const { serviceDescription } = new TrackingNumber(usps34v2TrackingNumber);
  t.falsy(serviceDescription);
});

test("USPS 34v2: report correct shipper_id", t => {
  const { shipperId } = new TrackingNumber(usps34v2TrackingNumber);
  t.is(shipperId, "00190132");
});

test("USPS 34v2: report correct destination", t => {
  const { destinationZip } = new TrackingNumber(usps34v2TrackingNumber);
  t.is(destinationZip, "10023");
});

test("USPS 34v2: report correct no package info", t => {
  const { packageType } = new TrackingNumber(usps34v2TrackingNumber);
  t.falsy(packageType);
});

test("USPS 34v2: have valid tracking url", t => {
  const { trackingUrl, trackingNumber } = new TrackingNumber(
    usps34v2TrackingNumber
  );
  t.truthy(trackingUrl);
  t.true(trackingUrl.includes(trackingNumber));
});

test("USPS 34v2: have valid courier info", t => {
  const { courierInfo } = new TrackingNumber(usps34v2TrackingNumber);
  t.deepEqual(courierInfo, {
    name: "United States Postal Service",
    courierCode: "usps"
  });
});

test("USPS 34v2: have valid info", t => {
  const { info, trackingUrl } = new TrackingNumber(usps34v2TrackingNumber);
  t.deepEqual(info, {
    courier: { name: "United States Postal Service", courierCode: "usps" },
    shipperId: "00190132",
    trackingUrl,
    destinationZip: "10023",
    packageType: undefined,
    serviceDescription: undefined,
    serviceType: undefined
  });
});

test("USPS 34v2: have valid decode", t => {
  const { decode } = new TrackingNumber(usps34v2TrackingNumber);
  t.deepEqual(decode, {
    ApplicationIdentifier: "92",
    CheckDigit: "7",
    DestinationZip: "10023",
    PackageId: "60760083345",
    RoutingApplicationId: "420",
    RoutingNumber: "3424",
    SerialNumber: "920019013260760083345",
    ShipperId: "00190132"
  });
});

// tracking number fedex
const fedexTrackingNumber = "000123450000000027";

test("FedEx: report correct courier name", t => {
  const { courierName } = new TrackingNumber(fedexTrackingNumber);
  t.is(courierName, "FedEx");
});

test("FedEx: report correct courier code", t => {
  const { courierCode } = new TrackingNumber(fedexTrackingNumber);
  t.is(courierCode, "fedex");
});

test("FedEx: report correct service", t => {
  const { serviceType } = new TrackingNumber(fedexTrackingNumber);
  t.falsy(serviceType);
});

test("FedEx: report correct missing service description", t => {
  const { serviceDescription } = new TrackingNumber(fedexTrackingNumber);
  t.falsy(serviceDescription);
});

test("FedEx: report correct no shipperId", t => {
  const { shipperId } = new TrackingNumber(fedexTrackingNumber);
  t.falsy(shipperId);
});

test("FedEx: report correct no destination", t => {
  const { destinationZip } = new TrackingNumber(fedexTrackingNumber);
  t.falsy(destinationZip);
});

test("FedEx: report correct package type", t => {
  const { packageType } = new TrackingNumber(fedexTrackingNumber);
  t.is(packageType, "case/carton");
});

test("FedEx: have valid tracking url", t => {
  const { trackingUrl, trackingNumber } = new TrackingNumber(
    fedexTrackingNumber
  );
  t.truthy(trackingUrl);
  t.true(trackingUrl.includes(trackingNumber));
});

test("FedEx: have valid info", t => {
  const { info, trackingUrl } = new TrackingNumber(fedexTrackingNumber);
  t.deepEqual(info, {
    courier: { name: "FedEx", courierCode: "fedex" },
    shipperId: undefined,
    trackingUrl,
    destinationZip: undefined,
    packageType: "case/carton",
    serviceDescription: undefined,
    serviceType: undefined
  });
});

test("FedEx: have valid decode", t => {
  const { decode } = new TrackingNumber(fedexTrackingNumber);
  t.deepEqual(decode, {
    CheckDigit: "7",
    SerialNumber: "012345000000002",
    ShippingContainerType: "00"
  });
});

// checksum tests
test("S10: checksum 0", t => {
  const s10TrackingSequence = "29492510";
  const checkDigit = 0;
  const answer = validation.s10(s10TrackingSequence, checkDigit);
  t.true(answer)
});

test("S10: fail checksum 0", t => {
  const s10TrackingSequence = "29492510";
  const checkDigit = 999;
  const answer = validation.s10(s10TrackingSequence, checkDigit);
  t.false(answer)
});

test("S10: checksum 5", t => {
  const s10TrackingSequence = "89006891";
  const checkDigit = 5;
  const answer = validation.s10(s10TrackingSequence, checkDigit);
  t.true(answer)
});

test("S10: fail checksum 5", t => {
  const s10TrackingSequence = "89006891";
  const checkDigit = 999;
  const answer = validation.s10(s10TrackingSequence, checkDigit);
  t.false(answer)
});