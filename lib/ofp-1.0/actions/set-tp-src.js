/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var util = require('util');
var ofp = require('../ofp.js');

var offsets = ofp.offsets.ofp_action_tp_port;

module.exports.unpack = function(buffer, offset) {
  var action = {
    "header" : {"type" : 'OFPAT_SET_TP_SRC'},
    "body" : {}
  };

  var len = buffer.readUInt16BE(offset + offsets.len, true);

  if (len != ofp.sizes.ofp_action_tp_port) {
    return {
      "error" : {
        "desc" : util.format('%s action at offset %d has invalid length (%d).', action.header.type, offset, len),
        "type" : 'OFPET_BAD_ACTION', "code" : 'OFPBAC_BAD_LEN'
      }
    };
  }

  action.body.tp_port = buffer.readUInt16BE(offset + offsets.tp_port, true);

  return {
    "action" : action,
    "offset" : offset + len
  };
};

module.exports.pack = function(action, buffer, offset) {
  if (buffer.length < offset + ofp.sizes.ofp_action_tp_port) {
    return {
      error : { desc : util.format('%s action at offset %d does not fit the buffer.', action.header.type, offset)}
    };
  }

  buffer.writeUInt16BE(ofp.ofp_action_type.OFPAT_SET_TP_SRC, offset + offsets.type, true);
  buffer.writeUInt16BE(ofp.sizes.ofp_action_tp_port, offset + offsets.len, true);
  buffer.writeUInt16BE(action.body.tp_port, offset + offsets.tp_port, true);

  return {
    "offset" : offset + ofp.sizes.ofp_action_tp_port
  };
};
