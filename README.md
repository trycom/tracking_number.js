# tracking_number.js

This lib identifies valid tracking numbers and can tell you a little bit about the shipment just from the number.

It detects tracking numbers from UPS, FedEx, DHL, USPS, OnTrac, Amazon Logistics, and 160+ countries national postal services (S10 standard).

Wraps JSON data from [a shared
repository](https://github.com/jkeen/tracking_number_data). It is
based off by jkeen's [Ruby
library](https://github.com/jkeen/tracking_number_data).

## Usage

#### Checking an individual tracking number

```javascript
const t = new TrackingNumber("MYSTERY_TRACKING_NUMBER");
console.log(t.valid); // false

const t = new TrackingNumber("1Z879E930346834440");
console.log(t.valid); // true
```

#### Courier Info

As of 1.0, the possible courier codes are `usps, fedex, ups, ontrac, dhl, amazon, s10`. S10 is the international standard used by local government post offices. When packages are shipped internationally via normal post, it's usually an S10 number.

```javascript
const t = new TrackingNumber("1Z879E930346834440");

console.log(t.valid); // true
console.log(t.courierCode); // "ups"
console.log(t.courierName); // "UPS"

const t = new TrackingNumber("RB123456785GB");
console.log(t.courierName); // "Royal Mail Group plc"
console.log(t.courierCode); // "s10"

const t = new TrackingNumber("1001901781990001000300617767839437");
console.log(t.courierName); // "United States Postal Service"
```

#### Service Type

Some tracking numbers indicate their service type

```javascript
const t = new TrackingNumber("1Z879E930346834440");
console.log(t.serviceType); // "UPS United States Ground""

const t = new TrackingNumber("1ZXX3150YW44070023");
console.log(t.serviceType); // "UPS SurePost - Delivered by the USPS"

const t = new TrackingNumber("RB123456785US");
console.log(t.serviceType); // "Letter Post Registered"
```

#### Shipper ID

Some tracking numbers indicate information about their package

```javascript
const t = new TrackingNumber("1Z6072AF0320751583");
console.log(t.shipperId); // "6072AF" <-- this is Target
```

#### Destination Zip

Some tracking numbers indicate their destination

```javascript
const t = new TrackingNumber("1001901781990001000300617767839437");
console.log(t.destinationZip); // "10003"
```

#### Package Info

Some tracking numbers indicate information about their package

```javascript
const t = new TrackingNumber("012345000000002");
console.log(t.packageType); // "case/carton"
```

#### Decoding

Most tracking numbers have a format where each part of the number has meaning. `decode` splits up the number into its known named parts.

```javascript
const t = new TrackingNumber("1Z879E930346834440");
console.log(t.decode);
```

## Copyright

Copyright (c) 2018 Try.com. See LICENSE for further details.
