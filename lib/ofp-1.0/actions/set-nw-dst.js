/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var util = require('util');
var ofp = require('../ofp.js');
var packet = require('../../packet.js');

var offsets = ofp.offsets.ofp_action_nw_addr;

module.exports.unpack = function(buffer, offset) {
  var action = {
    "header" : {"type" : 'OFPAT_SET_NW_DST'},
    "body" : {}
  };

  var len = buffer.readUInt16BE(offset + offsets.len, true);

  if (len != ofp.sizes.ofp_action_nw_addr) {
    return {
      "error" : {
        "desc" : util.format('%s action at offset %d has invalid length (%d).', action.header.type, offset, len),
        "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'
      }
    }
  }

  action.body.nw_addr = packet.ipv4ToString(buffer, offset + offsets.nw_addr);

  return {
    "action" : action,
    "offset" : offset + len
  }
};

module.exports.pack = function(action, buffer, offset) {
  if (buffer.length < offset + ofp.sizes.ofp_action_nw_addr) {
    return {
      error : { desc : util.format('%s action at offset %d does not fit the buffer.', action.header.type, offset)}
    };
  }

  buffer.writeUInt16BE(ofp.ofp_action_type.OFPAT_SET_NW_DST, offset + offsets.type, true);
  buffer.writeUInt16BE(ofp.sizes.ofp_action_nw_addr, offset + offsets.len, true);
  if (typeof(action.body.nw_addr) === 'string') {
      packet.stringToIPv4(action.body.nw_addr, buffer, offset + offsets.nw_addr);
  } else {
      buffer.writeUInt32BE(action.body.nw_addr, offset + offsets.nw_addr, true);
  }

  return {
    "offset" : offset + ofp.sizes.ofp_action_nw_addr
  };
};
