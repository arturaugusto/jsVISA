jsVISA
======

Control measurement devices and test equipment using JavaScript and WebSockets.

How to use:

1) Run start_server.py at the machine connected to the instrument;<br>
2) Create functions using JavaScript that connect to the server and communicate with the instruments.

Simple example:
`````javascript
_visa = new Visa("ws://localhost:8000/" ,function(visa){
	visa.getInstrument("GPIB0::3::INSTR", function(instrument){
		instrument.ask("*IDN?", function(read){
			console.log(read);
		});
	});
})
`````
See example.html for a more complete example.

Open Source libraries used on this project:<br>
<a href = https://github.com/opiate/SimpleWebSocketServer>SimpleWebSocketServer</a><br>
<a href = https://github.com/hgrecco/pyvisa>PyVISA</a>

This content is released under the <a href = https://github.com/arturaugusto/jsVISA/blob/master/LICENSE>MIT</a> License.
