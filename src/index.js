const XRegExp = require("xregexp");
XRegExp.install("namespacing");

const validation = require("./utils/validation");

// Couriers
const amazon = require("tracking_number_data/couriers/amazon.json");
const dhl = require("tracking_number_data/couriers/dhl.json");
const fedex = require("tracking_number_data/couriers/fedex.json");
const ontrac = require("tracking_number_data/couriers/ontrac.json");
const s10 = require("tracking_number_data/couriers/s10.json");
const ups = require("tracking_number_data/couriers/ups.json");
const usps = require("tracking_number_data/couriers/usps.json");

const couriers = [amazon, dhl, fedex, ontrac, s10, ups, usps];

const TrackingNumber = (function() {
  const privateProps = new WeakMap();

  class TrackingNumber {
    constructor(trackingNumber = this.throwIfMissingTrackingNumber()) {
      this.originalNumber = trackingNumber;
      this.trackingNumber = trackingNumber
        .replace(/\s/g, "")
        .trim()
        .toUpperCase();

      couriers.forEach(courier => {
        const { tracking_numbers } = courier;
        tracking_numbers.forEach(trackingNumber => {
          const {
            regex,
            additional = [],
            validation: {
              checksum,
              serial_number_format,
              additional: additionalValidation
            }
          } = trackingNumber;

          let regexString = regex;

          if (typeof regex !== "string") {
            regexString = regexString.join(" ");
          }

          const matches = XRegExp.exec(
            this.trackingNumber,
            XRegExp(regexString, "x")
          );

          if (matches) {
            const validate = validation[checksum.name];
            let serialNumber = matches.groups["SerialNumber"];

            if (serial_number_format) {
              const {
                prepend_if: { matches_regex, content }
              } = serial_number_format;

              if (XRegExp.exec(serialNumber, XRegExp(matches_regex, "x"))) {
                serialNumber = `${content}${serialNumber}`;
                matches.groups["SerialNumber"] = serialNumber;
              }
            }

            if (
              validate(serialNumber, matches.groups["CheckDigit"], checksum)
            ) {
              const matchingAdditional = {};
              additional.forEach(addition => {
                const { name, lookup, regex_group_name } = addition;

                lookup.forEach(lookup => {
                  if (lookup.matches === matches.groups[regex_group_name]) {
                    matchingAdditional[name] = lookup;
                  } else if (
                    XRegExp.exec(
                      matches.groups[regex_group_name],
                      XRegExp(lookup.matches_regex, "x")
                    ) &&
                    XRegExp.exec(
                      matches.groups[regex_group_name],
                      XRegExp(lookup.matches_regex, "x")
                    )[0] !== ""
                  ) {
                    matchingAdditional[name] = lookup;
                  }
                });
              });

              let valid = true;

              if (additionalValidation) {
                const { exists } = additionalValidation;
                exists.forEach(groupName => {
                  if (!matchingAdditional[groupName]) {
                    valid = false;
                  }
                });
              }

              if (valid) {
                privateProps.set(this, {
                  courier,
                  validation: trackingNumber,
                  matches: matches.groups,
                  matchingAdditional
                });
              }
            }
          }
        });
      });
    }

    throwIfMissingTrackingNumber() {
      throw new Error("Missing Tracking Number in Constructor");
    }

    get valid() {
      return privateProps.get(this) !== undefined;
    }

    get courierInfo() {
      const {
        courier: { name, courier_code },
        matchingAdditional: { Courier }
      } = privateProps.get(this);

      const returnObj = {
        name: Courier ? Courier.courier : name,
        courierCode: courier_code,
        ...Courier
      };

      if (Courier) {
        delete returnObj.courier;
      }

      delete returnObj.tracking_numbers;
      delete returnObj.matches;
      delete returnObj.matches_regex;

      return returnObj;
    }

    get info() {
      const {
        courierInfo,
        serviceType,
        serviceDescription,
        destinationZip,
        shipperId,
        packageType,
        trackingUrl
      } = this;

      return {
        courier: courierInfo,
        serviceType,
        serviceDescription,
        destinationZip,
        shipperId,
        packageType,
        trackingUrl
      };
    }

    get courierName() {
      const {
        courier,
        matchingAdditional: { Courier }
      } = privateProps.get(this);

      if (Courier) {
        return Courier.courier;
      }

      return courier.name;
    }

    get courierCode() {
      const { courier } = privateProps.get(this);
      return courier.courier_code;
    }

    get serviceType() {
      const { matchingAdditional } = privateProps.get(this);
      const serviceType = matchingAdditional["Service Type"];

      if (serviceType) {
        return serviceType.name;
      }

      return undefined;
    }

    get serviceDescription() {
      const { matchingAdditional } = privateProps.get(this);
      const serviceDescription = matchingAdditional["Service Type"];

      if (serviceDescription) {
        return matchingAdditional["Service Type"].description;
      }

      return undefined;
    }

    get shipperId() {
      const { matches } = privateProps.get(this);
      return matches["ShipperId"];
    }

    get trackingUrl() {
      const {
        validation,
        matchingAdditional: { Courier }
      } = privateProps.get(this);

      const url = validation.tracking_url;

      if (url) {
        return url.replace("%s", this.trackingNumber);
      }

      return undefined;
    }

    get packageType() {
      const { matchingAdditional } = privateProps.get(this);
      const containerType = matchingAdditional["Container Type"];

      if (containerType) {
        return containerType.name;
      }

      return undefined;
    }

    get destinationZip() {
      const { matches } = privateProps.get(this);
      return matches["DestinationZip"];
    }

    get decode() {
      const { matches } = privateProps.get(this);
      return matches;
    }
  }

  return TrackingNumber;
})();

module.exports = TrackingNumber;
