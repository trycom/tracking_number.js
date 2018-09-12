import test from "ava";
import TrackingNumber from "./src";

// a tracking number
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

test("UPS: report correct service", t => {
  const { serviceType } = new TrackingNumber(upsTrackingNumber);
  t.is(serviceType, "UPS United States Ground");
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

// tracking number additional data for S10
const s10TrackingNumber = "RB123456785GB";

test("S10: report correct courier name", t => {
  const { courierName } = new TrackingNumber(s10TrackingNumber);
  t.is(courierName, "Royal Mail Group plc");
});

test("S10: report correct service", t => {
  const { serviceType } = new TrackingNumber(s10TrackingNumber);
  t.is(serviceType, "Letter Post Registered");
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

// tracking number additional data for USPS 20
const uspsTrackingNumber = "0307 1790 0005 2348 3741";

test("USPS 20: report correct courier name", t => {
  const { courierName } = new TrackingNumber(uspsTrackingNumber);
  t.is(courierName, "United States Postal Service");
});

test("USPS 20: report correct service", t => {
  const { serviceType } = new TrackingNumber(uspsTrackingNumber);
  t.falsy(serviceType);
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

// tracking number additional data for USPS 34v2
const usps34v2TrackingNumber = "4201002334249200190132607600833457";

test("USPS 34v2: report correct courier name", t => {
  const { courierName } = new TrackingNumber(usps34v2TrackingNumber);
  t.is(courierName, "United States Postal Service");
});

test("USPS 34v2: report correct service", t => {
  const { serviceType } = new TrackingNumber(usps34v2TrackingNumber);
  t.falsy(serviceType);
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
