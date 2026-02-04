# Usage Examples - MCP for Samsara

Real-world examples of what you can do with Claude + Samsara integration.

---

## 🚚 Route Management

### Create a Multi-Stop Delivery Route

**Prompt:**
```
Create a new route called "Downtown Deliveries - Monday AM" with these stops:

1. Start at our warehouse: 100 Industrial Parkway, Charlotte, NC 28273
2. ABC Corporation: 250 Trade Street, Charlotte, NC 28202
3. XYZ Enterprises: 500 South Tryon Street, Charlotte, NC 28202
4. ACME Inc: 1000 West Trade Street, Charlotte, NC 28216
5. Return to warehouse

Schedule it to start tomorrow at 8:00 AM.
Assign it to vehicle V123 and driver D456.
```

**What happens:**
- Claude creates route with 5 stops
- Automatically geocodes addresses
- Sets start time
- Assigns vehicle and driver
- Returns route ID for tracking

---

### Update Route with State Preservation

**Prompt:**
```
For route RT789, change stop 2 to "456 New Location St" 
and update the driver to D789
```

**What happens:**
- Claude fetches existing route
- **Automatically preserves all stop IDs** (critical!)
- Updates only what you specified
- Keeps arrival/departure times intact
- Returns updated route

**Why this matters:** Without state preservation, you'd lose all time tracking data!

---

### Optimize Route for Efficiency

**Prompt:**
```
Take route RT789 and optimize the stop order to minimize total distance
```

**What happens:**
- Fetches current route
- Runs optimization algorithm
- Reorders stops (keeps first/last as depots)
- **Preserves all stop IDs and data**
- Shows before/after order
- Returns optimized route

**Sample output:**
```
Route optimized!

Original order:
1. Warehouse
2. Customer A (15 miles away)
3. Customer B (2 miles from warehouse)
4. Customer C (10 miles from B)
5. Warehouse

Optimized order:
1. Warehouse
2. Customer B (2 miles)
3. Customer C (5 miles from B)
4. Customer A (8 miles from C)
5. Warehouse (10 miles)

Total distance reduced: 35 miles → 25 miles (28% improvement)
```

---

## 📍 Vehicle Tracking

### Get Real-Time Locations

**Prompt:**
```
Show me current locations for all vehicles that are currently on routes
```

**What happens:**
- Lists all routes in progress
- Gets real-time GPS for assigned vehicles
- Shows address, speed, heading
- Displays time of last update

---

### Track Specific Vehicle

**Prompt:**
```
Where is vehicle V123 right now? Show me its location history for the past 2 hours.
```

**What happens:**
- Gets most recent location
- Fetches location feed for past 2 hours
- Shows movement pattern
- Calculates distance traveled

---

## 👨‍✈️ Driver Management

### Check Driver Compliance

**Prompt:**
```
Get Hours of Service logs for driver D456 for the past week. 
Are there any violations?
```

**What happens:**
- Fetches HOS logs (drive time, duty time, breaks)
- Analyzes for DOT compliance
- Flags any violations
- Suggests corrective actions

---

### Monitor Driver Safety

**Prompt:**
```
Show me all safety events (harsh braking, speeding, etc.) 
for driver D456 in the last 30 days
```

**What happens:**
- Gets harsh events from API
- Categorizes by type
- Shows frequency and severity
- Identifies patterns

---

## 🔔 Webhook Integration

### Set Up Route Update Notifications

**Prompt:**
```
Create a webhook that sends notifications to https://myapp.com/webhooks/samsara
whenever a route is updated or completed
```

**What happens:**
- Creates webhook with URL
- Subscribes to route.updated and route.completed events
- Returns webhook ID
- Sets up secure signature verification

**Then your app receives:**
```json
{
  "eventType": "route.updated",
  "data": {
    "routeId": "RT789",
    "status": "en route",
    "currentStopIndex": 2,
    "timestamp": "2024-02-03T15:30:00Z"
  }
}
```

---

## 🗺️ Advanced Use Cases

### Multi-Route Daily Planning

**Prompt:**
```
I need to plan deliveries for tomorrow. I have:
- 20 deliveries to make
- 3 available drivers
- 3 vehicles

Create 3 optimized routes that:
1. Balance the workload evenly
2. Minimize total distance
3. Start at 8 AM from our warehouse
4. Return by 5 PM

Here are the delivery addresses: [list]
```

**What happens:**
- Claude analyzes addresses
- Groups by geographic proximity
- Creates 3 balanced routes
- Optimizes each route
- Assigns vehicles and drivers
- Returns all route IDs

---

### TMS Integration Workflow

**Prompt:**
```
I have orders from my TMS:
- Order 12345: Deliver to 123 Main St
- Order 12346: Deliver to 456 Oak Ave
- Order 12347: Deliver to 789 Pine Rd

Create a route with these orders and link them using external IDs 
so I can track back to my TMS
```

**What happens:**
- Creates route with stops
- Adds externalIds: { tmsOrderId: "12345" }
- Links each stop to TMS order
- Returns route with mappings

**Later you can:**
```
Find the route that contains TMS order 12345
```

Claude searches externalIds and returns the route!

---

### Fleet Analytics

**Prompt:**
```
For the past month:
1. Show total miles driven by each vehicle
2. Calculate fuel efficiency
3. Identify vehicles that need maintenance
4. Show driver utilization rates
```

**What happens:**
- Fetches vehicle stats for date range
- Calculates metrics
- Generates report
- Flags maintenance needs

---

## 🎯 Pro Tips

### Use Natural Language

You don't need to know API syntax. Just ask naturally:

❌ Don't say: "Execute samsara_create_route with parameters..."
✅ Do say: "Create a route called ABC with these stops..."

### Let Claude Handle Complexity

❌ Don't say: "Get route RT123, extract stop IDs, then update..."
✅ Do say: "Update route RT123 to change stop 2"

Claude handles stop ID preservation automatically!

### Chain Multiple Operations

**Prompt:**
```
1. Create a route with these 5 stops
2. Optimize it for minimum distance
3. Assign to the closest available driver
4. Send me a webhook when it's completed
```

Claude will execute all 4 steps in sequence!

---

## 🚀 Next Level

### Build Custom Automations

**Prompt:**
```
Every Monday at 7 AM, I want to:
1. Get all pending orders from my TMS
2. Create optimized routes for them
3. Assign to available drivers
4. Send summary email

Can you help me set this up?
```

Claude can guide you through webhook setup, route creation patterns, and automation logic!

---

## 📚 More Examples

Want more? Join our community:
- [Discord](https://discord.gg/automation-squad)
- [GitHub Discussions](https://github.com/automation-squad/mcp-samsara/discussions)

Share your use cases and learn from others!

---

**The possibilities are endless. What will you build? 🚀**
