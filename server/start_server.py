import json
import visa
from SimpleWebSocketServer import WebSocket, SimpleWebSocketServer
class VisaHandler(WebSocket):
	instruments = dict()
	def handleMessage(self):
		if self.data is None:
			self.data = ''
		else:
			self.decoded_msg = json.loads(str(self.data))
			if self.decoded_msg["action"] == "connect":
				# Create instrument instance
				self.instruments[self.decoded_msg["addr"]] = visa.instrument(self.decoded_msg["addr"], term_chars = self.decoded_msg["term_chars"], timeout = int(self.decoded_msg["timeout"]) )
				print "Connected to instrument at address " + self.decoded_msg["addr"]
			elif self.decoded_msg["action"] == "write":
				# Write to instrument
				self.instruments[self.decoded_msg["addr"]].write(self.decoded_msg["cmd"])
				print "Writing to instrument " + self.decoded_msg["addr"] + ", command: " + self.decoded_msg["cmd"]
			elif self.decoded_msg["action"] == "read":
				# Read from instrument
				print "Reading from instrument " + self.decoded_msg["addr"]
				read = self.instruments[self.decoded_msg["addr"]].read()
				print read
				msg = {'key': self.decoded_msg["key"], 'read': read}
				# Send data to client
				self.sendMessage(json.dumps(msg))
			else:
				print "None"
	def handleConnected(self):
		print self.address, 'connected'
	def handleClose(self):
		print self.address, 'closed'
server = SimpleWebSocketServer('', 8000, VisaHandler)
server.serveforever()