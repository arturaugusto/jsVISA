// jsVISA.js 1.1
// (c) 2014 Artur Augusto Martins 
// jsVISA.js is freely distributable under the MIT license.
// For all details and documentation:
// https://github.com/arturaugusto/jsVISA 

(function() {
	var Visa = function(server, cb) {
		// Store callback functions
		var key_callback_pairs = {};
		this.key_callback_pairs = key_callback_pairs;
		var server = server || "ws://localhost:8000/";
		this.server = server;
		// Create websocket
		var websocket = new WebSocket(server);
		this.websocket = websocket;
		var visa = this;
		this.websocket.onopen = function(evt) { 
			cb(visa);
		};
		this.websocket.onmessage = function(evt) { 
			// Call requested callback function
			var returned_msg = JSON.parse(evt.data);
			var key = returned_msg["key"];
			try
				{
				key_callback_pairs[key](returned_msg.read);
				}
			catch(err)
				{
				console.log("Error executing read callback. Error: " + err);
				}
			delete key_callback_pairs[key];
		};
		// To implement
		//this.websocket.onclose = function(evt) { onClose(evt) };
		this.websocket.onerror = function(evt) {
			alert("WebSocket Error.");
			visa.close();
		};
		Visa.Instrument = function(options){
			var addr = options.addr;
			var term_chars = options.term_chars;
			var timeout = options.timeout;
			var msg = {action: "connect", addr: addr, term_chars: term_chars, timeout: timeout};
			visa.websocket.send(JSON.stringify(msg));
			inst = this;
			// Write to instrument
			this.write = function(cmd){
				var msg = {action: "write", addr: addr, cmd: cmd}
				visa.websocket.send(JSON.stringify(msg));
			}
			// Read from instrument async
			this.read = function(cb){
				// Create new random key for each read
				var key = Math.random().toString(36).substring(7);
				visa.key_callback_pairs[key] = cb;
				var msg = {action: "read", key: key, addr: addr}
				visa.websocket.send(JSON.stringify(msg));
			}
			// Write + Read
			this.ask = function(cmd, cb){
				inst.write(cmd)
				inst.read(cb)
			}
		}
		// Create an Instrument instance
		this.getInstrument = function(addr, cb, term_chars, timeout){
			var term_chars = term_chars || "\n";
			var timeout = timeout || "10";
			cb(new Visa.Instrument({addr: addr, term_chars: term_chars, timeout: timeout}));
		}
		//Close Websocket
		this.close = function(){
			visa.websocket.close();
		}
	}
	window.Visa = Visa;
})();
