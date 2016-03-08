var serverPort = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var serverIPAddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(serverPort, serverIPAddress, function() {
  console.log('Listening on ' + serverIPAddress + ':' + serverPort);
});
