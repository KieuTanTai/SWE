import { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ port: 8050 });

// Map to store clients by role: { 'admin': [ws1, ws2], 'parent': [ws3], 'driver': [ws4] }
const clientsByRole = new Map();

wss.on('connection', function connection(ws) {
  let userRole = null;
  let userId = null;

  ws.on('message', function incoming(raw) {
    try {
      const data = JSON.parse(raw.toString());
      
      // Register user with their role
      if (data.type === 'register' && data.role) {
        userRole = data.role; // 'admin', 'parent', or 'driver'
        userId = data.userId || Date.now().toString();
        
        // Add to role group
        if (!clientsByRole.has(userRole)) {
          clientsByRole.set(userRole, new Map());
        }
        clientsByRole.get(userRole).set(userId, ws);
        
        console.log(`User ${userId} registered as ${userRole}`);
        ws.send(JSON.stringify({ 
          type: 'info', 
          message: `Registered as ${userRole}` 
        }));
      }
      
      // Broadcast alert to specific role group
      if (data.type === 'alert' && data.recipient && data.message) {
        const recipientRole = data.recipient; // 'parent' or 'driver'
        const recipients = clientsByRole.get(recipientRole);
        
        if (recipients && recipients.size > 0) {
          let successCount = 0;
          recipients.forEach((clientWs) => {
            if (clientWs.readyState === 1) { // WebSocket.OPEN = 1
              clientWs.send(JSON.stringify({
                type: 'alert',
                message: data.message,
                timestamp: data.timestamp || new Date().toISOString(),
                from: 'admin'
              }));
              successCount++;
            }
          });
          console.log(`Alert broadcast to ${successCount} ${recipientRole}(s): ${data.message}`);
          
          // Send confirmation back to admin
          ws.send(JSON.stringify({
            type: 'alert_sent',
            success: true,
            recipientCount: successCount,
            recipientRole: recipientRole
          }));
        } else {
          console.log(`No ${recipientRole} clients connected`);
          ws.send(JSON.stringify({
            type: 'alert_sent',
            success: false,
            message: `No ${recipientRole} clients connected`
          }));
        }
      }
    } catch (e) {
      console.error('Error processing message:', e);
    }
  });

  ws.on('close', function () {
    if (userRole && userId) {
      const roleClients = clientsByRole.get(userRole);
      if (roleClients) {
        roleClients.delete(userId);
        console.log(`User ${userId} (${userRole}) disconnected`);
      }
    }
  });
});

console.log('WebSocket server is running on ws://localhost:8050');