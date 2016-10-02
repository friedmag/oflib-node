/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var util = require('util');

var ofp = require('./ofp.js');
var ofp10 = require('./ofp-1.0/ofp.js');
var msg10 = require('./ofp-1.0/message.js');
var msg11 = require('./ofp-1.1/message.js');

module.exports = {
        struct : 'message',

        unpack : function(buffer, offset) {
                        if (!offset) { offset = 0; }

                        var version = buffer.readUInt8(offset + ofp.offsets.ofp_header.version, true);

                        switch (version) {
                            case 0x01: { return msg10.unpack(buffer, offset); }
                            case 0x02: { return msg11.unpack(buffer, offset); }
                            default: {

                              // Special case for HELLO - interpret it and pass it up the chain, the application can respond with a different version
                              var type = buffer.readUInt8(offset + ofp.offsets.ofp_header.type, true);
                              if (type === ofp10.ofp_type.OFPT_HELLO) {
                                return msg10.unpack(buffer, offset);
                              }

                              console.log("Still erroring?");
                                return {
                                    error : {
                                        desc : util.format('message at offset %d has unsupported version (%d).', offset, version)
                                    }
                                }
                            }
                        }
                },
        pack : function(message, buffer, offset) {
             
	 				   if (!offset) { offset = 0; } 
                       
					   // var version = 0x00;
                    
	                   switch(message.version)  {
		                    case 0x01 : {return msg10.pack(message, buffer, offset); }
		                    case 0x02 : {return msg11.pack(message, buffer, offset); }
		                    default:{
                                return {
                                    error : {
                                        desc : util.format('message at offset %d has unsupported version (%s).', offset, message.version)
                                    }
                                }
                            } 
	                   }
       

        }
}
