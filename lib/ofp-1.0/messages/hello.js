/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

(function() {

var util = require('util');
var ofp = require('../ofp.js');

var offsets = ofp.offsets.ofp_header;

module.exports = {
            "unpack" : function(buffer, offset, len) {
                    if (len != ofp.sizes.ofp_header) {
                        return {
                            "error" : {
                                "desc" : util.format('hello message at offset %d has invalid length (%d).', offset, len),
                                "type" : 'OFPET_BAD_REQUEST', "code" : 'OFPBRC_BAD_LEN'
                            }
                        }
                    }

                    var message = {
                      header: {type: 'OFPT_HELLO'},
                    };

                    return {
                        message,
                        offset: offset + len,
                    }
            },
			"pack" : function(message, buffer, offset) {
                    buffer.writeUInt8(ofp.ofp_type.OFPT_HELLO, offset + offsets.type, true);
                    buffer.writeUInt16BE(ofp.sizes.ofp_header, offset + offsets.length, true);

                    return {
                        offset : offset + ofp.sizes.ofp_header
                    }
            }

}

})();
