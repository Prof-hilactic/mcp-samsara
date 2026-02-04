#!/usr/bin/env node

/**
 * Automation Squad - MCP for Samsara
 * 
 * Complete Samsara Fleet Management API integration
 * Built with expert knowledge and production best practices
 * 
 * UNOFFICIAL: Not affiliated with Samsara Inc.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Configuration
const SAMSARA_API_TOKEN = process.env.SAMSARA_API_TOKEN;
const SAMSARA_BASE_URL = process.env.SAMSARA_BASE_URL || "https://api.samsara.com";

if (!SAMSARA_API_TOKEN) {
  console.error("Error: SAMSARA_API_TOKEN environment variable is required");
  process.exit(1);
}

// Rate limiting
class RateLimiter {
  private requests: number[] = [];
  private readonly maxPerSecond = 5; // Conservative limit

  async throttle(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < 1000);
    
    if (this.requests.length >= this.maxPerSecond) {
      const oldest = this.requests[0];
      const wait = 1000 - (now - oldest) + 10;
      await new Promise(r => setTimeout(r, wait));
      return this.throttle();
    }
    
    this.requests.push(now);
  }
}

const rateLimiter = new RateLimiter();

// API client
async function samsaraRequest(endpoint: string, options: RequestInit = {}) {
  await rateLimiter.throttle();
  
  const url = `${SAMSARA_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${SAMSARA_API_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    const wait = retryAfter ? parseInt(retryAfter) * 1000 : 2000;
    await new Promise(r => setTimeout(r, wait));
    return samsaraRequest(endpoint, options);
  }

  if (!response.ok) {
    const errorBody: any = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`Samsara API error (${response.status}): ${errorBody.message || response.statusText}`);
  }

  return response.json();
}

// Initialize MCP server
const server = new Server(
  {
    name: "mcp-samsara",
    version: "1.0.0-beta.1",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // ===== VEHICLE TOOLS =====
      {
        name: "samsara_list_vehicles",
        description: "List all vehicles in the fleet. Returns vehicle details including ID, name, VIN, make, model, and external IDs for TMS integration.",
        inputSchema: {
          type: "object",
          properties: {
            limit: {
              type: "number",
              description: "Maximum number of vehicles to return (default: 50, max: 512)",
              default: 50
            },
            after: {
              type: "string",
              description: "Pagination cursor from previous response"
            }
          }
        }
      },
      {
        name: "samsara_get_vehicle",
        description: "Get detailed information about a specific vehicle by ID",
        inputSchema: {
          type: "object",
          properties: {
            vehicleId: {
              type: "string",
              description: "The unique ID of the vehicle"
            }
          },
          required: ["vehicleId"]
        }
      },
      {
        name: "samsara_get_vehicle_locations",
        description: "Get real-time or recent locations for vehicles. Uses the feed API pattern for efficient streaming of location data.",
        inputSchema: {
          type: "object",
          properties: {
            vehicleIds: {
              type: "array",
              items: { type: "string" },
              description: "Optional array of specific vehicle IDs. If omitted, returns locations for all vehicles."
            },
            after: {
              type: "string",
              description: "Timestamp (ISO 8601) to get locations after this time. Leave empty for most recent."
            }
          }
        }
      },
      {
        name: "samsara_get_vehicle_stats",
        description: "Get vehicle statistics including odometer, engine hours, and fuel usage over a time range",
        inputSchema: {
          type: "object",
          properties: {
            vehicleIds: {
              type: "array",
              items: { type: "string" },
              description: "Array of vehicle IDs to get stats for"
            },
            startTime: {
              type: "string",
              description: "Start time in ISO 8601 format (e.g., 2024-01-01T00:00:00Z)"
            },
            endTime: {
              type: "string",
              description: "End time in ISO 8601 format"
            }
          },
          required: ["vehicleIds", "startTime", "endTime"]
        }
      },

      // ===== ROUTE TOOLS =====
      {
        name: "samsara_list_routes",
        description: "List all routes. Routes contain ordered stops with addresses, times, and status tracking.",
        inputSchema: {
          type: "object",
          properties: {
            limit: {
              type: "number",
              description: "Maximum routes to return (default: 50)",
              default: 50
            },
            after: {
              type: "string",
              description: "Pagination cursor"
            }
          }
        }
      },
      {
        name: "samsara_get_route",
        description: "Get detailed information about a specific route including all stops, assigned vehicle/driver, and status",
        inputSchema: {
          type: "object",
          properties: {
            routeId: {
              type: "string",
              description: "The unique ID of the route"
            }
          },
          required: ["routeId"]
        }
      },
      {
        name: "samsara_create_route",
        description: "Create a new route with stops. IMPORTANT: Each stop needs address (with lat/long or formatted address), optional arrival/departure times, and names. Use externalIds to link with your TMS.",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name for this route (e.g., 'Morning Deliveries Zone 3')"
            },
            vehicleId: {
              type: "string",
              description: "Optional: ID of vehicle assigned to this route"
            },
            driverId: {
              type: "string",
              description: "Optional: ID of driver assigned to this route"
            },
            stops: {
              type: "array",
              description: "Array of stops in order. Each stop must have an address with coordinates or formattedAddress.",
              items: {
                type: "object",
                properties: {
                  address: {
                    type: "object",
                    properties: {
                      formattedAddress: { type: "string" },
                      latitude: { type: "number" },
                      longitude: { type: "number" },
                      name: { type: "string" },
                      street: { type: "string" },
                      city: { type: "string" },
                      state: { type: "string" },
                      zip: { type: "string" }
                    }
                  },
                  name: { type: "string", description: "Stop name (e.g., 'Customer ABC Warehouse')" },
                  notes: { type: "string", description: "Special instructions" },
                  arrivalTime: { type: "string", description: "ISO 8601 datetime" },
                  departureTime: { type: "string", description: "ISO 8601 datetime" }
                },
                required: ["address"]
              }
            },
            externalIds: {
              type: "object",
              description: "Key-value pairs for TMS integration (e.g., {tmsOrderId: '12345'})"
            },
            startTime: {
              type: "string",
              description: "Route start time (ISO 8601)"
            }
          },
          required: ["name", "stops"]
        }
      },
      {
        name: "samsara_update_route",
        description: "Update a route. CRITICAL BEST PRACTICE: This tool automatically preserves stop IDs to maintain arrival/departure time tracking. You can update name, vehicle, driver, status, or modify stops. When updating stops, the tool fetches existing stop IDs and preserves them.",
        inputSchema: {
          type: "object",
          properties: {
            routeId: {
              type: "string",
              description: "ID of route to update"
            },
            name: { type: "string", description: "New route name" },
            vehicleId: { type: "string", description: "New vehicle assignment" },
            driverId: { type: "string", description: "New driver assignment" },
            status: {
              type: "string",
              enum: ["scheduled", "en route", "completed", "cancelled"],
              description: "Update route status"
            },
            stops: {
              type: "array",
              description: "Updated stops array. Stop IDs will be automatically preserved if not provided.",
              items: {
                type: "object",
                properties: {
                  id: { type: "string", description: "Optional: Include to explicitly preserve stop" },
                  address: { type: "object" },
                  name: { type: "string" },
                  notes: { type: "string" },
                  arrivalTime: { type: "string" },
                  departureTime: { type: "string" }
                }
              }
            }
          },
          required: ["routeId"]
        }
      },
      {
        name: "samsara_delete_route",
        description: "Delete a route permanently",
        inputSchema: {
          type: "object",
          properties: {
            routeId: { type: "string", description: "ID of route to delete" }
          },
          required: ["routeId"]
        }
      },
      {
        name: "samsara_optimize_route",
        description: "Optimize route stop order to minimize distance/time. This is a value-add feature that reorders stops for efficiency while preserving all stop data and IDs.",
        inputSchema: {
          type: "object",
          properties: {
            routeId: { type: "string", description: "Route ID to optimize" },
            optimizationGoal: {
              type: "string",
              enum: ["distance", "time", "fuel"],
              description: "What to optimize for",
              default: "distance"
            }
          },
          required: ["routeId"]
        }
      },

      // ===== DRIVER TOOLS =====
      {
        name: "samsara_list_drivers",
        description: "List all drivers in the organization with their details and external IDs",
        inputSchema: {
          type: "object",
          properties: {
            limit: { type: "number", default: 50 },
            after: { type: "string" }
          }
        }
      },
      {
        name: "samsara_get_driver",
        description: "Get detailed information about a specific driver",
        inputSchema: {
          type: "object",
          properties: {
            driverId: { type: "string", description: "Driver ID" }
          },
          required: ["driverId"]
        }
      },
      {
        name: "samsara_get_driver_hos",
        description: "Get Hours of Service (HOS) logs for a driver. Essential for compliance tracking.",
        inputSchema: {
          type: "object",
          properties: {
            driverId: { type: "string" },
            startTime: { type: "string", description: "ISO 8601 start time" },
            endTime: { type: "string", description: "ISO 8601 end time" }
          },
          required: ["driverId", "startTime", "endTime"]
        }
      },
      {
        name: "samsara_get_driver_safety_events",
        description: "Get safety events (harsh braking, acceleration, speeding, etc.) for a driver",
        inputSchema: {
          type: "object",
          properties: {
            driverId: { type: "string" },
            startTime: { type: "string" },
            endTime: { type: "string" }
          },
          required: ["driverId", "startTime", "endTime"]
        }
      },

      // ===== ADDRESS & GEOFENCE TOOLS =====
      {
        name: "samsara_create_address",
        description: "Create a saved address/location in Samsara for reuse in routes",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Address name" },
            formattedAddress: { type: "string" },
            latitude: { type: "number" },
            longitude: { type: "number" },
            externalIds: { type: "object" }
          },
          required: ["name"]
        }
      },
      {
        name: "samsara_list_addresses",
        description: "List all saved addresses",
        inputSchema: {
          type: "object",
          properties: {
            limit: { type: "number", default: 50 },
            after: { type: "string" }
          }
        }
      },

      // ===== WEBHOOK TOOLS =====
      {
        name: "samsara_create_webhook",
        description: "Create a webhook to receive real-time notifications from Samsara (route updates, vehicle events, etc.)",
        inputSchema: {
          type: "object",
          properties: {
            url: { type: "string", description: "Your webhook endpoint URL (must be HTTPS)" },
            eventTypes: {
              type: "array",
              items: { type: "string" },
              description: "Array of event types to subscribe to (e.g., ['route.updated', 'vehicle.location'])"
            },
            secret: {
              type: "string",
              description: "Optional secret for webhook signature verification"
            }
          },
          required: ["url", "eventTypes"]
        }
      },
      {
        name: "samsara_list_webhooks",
        description: "List all configured webhooks",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "samsara_delete_webhook",
        description: "Delete a webhook subscription",
        inputSchema: {
          type: "object",
          properties: {
            webhookId: { type: "string" }
          },
          required: ["webhookId"]
        }
      },

      // ===== CONTACTS (FOR ROUTE STOPS) =====
      {
        name: "samsara_create_contact",
        description: "Create a contact (person at a stop location) for route management",
        inputSchema: {
          type: "object",
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            externalIds: { type: "object" }
          },
          required: ["firstName"]
        }
      },
      {
        name: "samsara_list_contacts",
        description: "List all contacts",
        inputSchema: {
          type: "object",
          properties: {
            limit: { type: "number", default: 50 }
          }
        }
      }
    ]
  };
});

// Tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  // Ensure args is defined
  const toolArgs = (args || {}) as Record<string, any>;

  try {
    switch (name) {
      // ===== VEHICLE TOOLS =====
      case "samsara_list_vehicles": {
        const params = new URLSearchParams();
        params.set('limit', (toolArgs.limit || 50).toString());
        if (toolArgs.after) params.set('after', toolArgs.after);
        
        const response = await samsaraRequest(`/fleet/vehicles?${params}`);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response, null, 2)
          }]
        };
      }

      case "samsara_get_vehicle": {
        const response = await samsaraRequest(`/fleet/vehicles/${toolArgs.vehicleId}`);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response, null, 2)
          }]
        };
      }

      case "samsara_get_vehicle_locations": {
        const params = new URLSearchParams();
        if (toolArgs.vehicleIds && toolArgs.vehicleIds.length) {
          params.set('vehicleIds', toolArgs.vehicleIds.join(','));
        }
        if (toolArgs.after) params.set('after', toolArgs.after);
        
        const response = await samsaraRequest(`/fleet/vehicles/locations/feed?${params}`);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response, null, 2)
          }]
        };
      }

      case "samsara_get_vehicle_stats": {
        const params = new URLSearchParams();
        params.set('vehicleIds', toolArgs.vehicleIds.join(','));
        params.set('startTime', toolArgs.startTime);
        params.set('endTime', toolArgs.endTime);
        params.set('types', 'obdOdometerMeters,obdEngineSeconds,fuelPercents');
        
        const response = await samsaraRequest(`/fleet/vehicles/stats/feed?${params}`);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response, null, 2)
          }]
        };
      }

      // ===== ROUTE TOOLS =====
      case "samsara_list_routes": {
        const params = new URLSearchParams();
        params.set('limit', (toolArgs.limit || 50).toString());
        if (toolArgs.after) params.set('after', toolArgs.after);
        
        const response = await samsaraRequest(`/fleet/routes?${params}`);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response, null, 2)
          }]
        };
      }

      case "samsara_get_route": {
        const response = await samsaraRequest(`/fleet/routes/${toolArgs.routeId}`);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response, null, 2)
          }]
        };
      }

      case "samsara_create_route": {
        const response = await samsaraRequest('/fleet/routes', {
          method: 'POST',
          body: JSON.stringify(args)
        });
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response, null, 2)
          }]
        };
      }

      case "samsara_update_route": {
        // CRITICAL: Auto-preserve stop IDs
        const existing: any = await samsaraRequest(`/fleet/routes/${toolArgs.routeId}`);
        
        const updatePayload: any = {};
        if (toolArgs.name) updatePayload.name = toolArgs.name;
        if (toolArgs.vehicleId !== undefined) updatePayload.vehicleId = toolArgs.vehicleId;
        if (toolArgs.driverId !== undefined) updatePayload.driverId = toolArgs.driverId;
        if (toolArgs.status) updatePayload.status = toolArgs.status;
        
        if (toolArgs.stops) {
          updatePayload.stops = toolArgs.stops.map((stop: any, index: number) => {
            if (stop.id) return stop;
            const existingStop = existing.data?.stops?.[index];
            if (existingStop?.id) {
              return { ...stop, id: existingStop.id };
            }
            return stop;
          });
        }
        
        const response = await samsaraRequest(`/fleet/routes/${toolArgs.routeId}`, {
          method: 'PATCH',
          body: JSON.stringify(updatePayload)
        });
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response, null, 2)
          }]
        };
      }

      case "samsara_delete_route": {
        await samsaraRequest(`/fleet/routes/${toolArgs.routeId}`, { method: 'DELETE' });
        return {
          content: [{
            type: "text",
            text: `Route ${toolArgs.routeId} deleted successfully`
          }]
        };
      }

      case "samsara_optimize_route": {
        // Get current route
        const route: any = await samsaraRequest(`/fleet/routes/${toolArgs.routeId}`);
        const stops = route.data?.stops || [];
        
        if (stops.length < 3) {
          return {
            content: [{
              type: "text",
              text: "Route has too few stops to optimize (need at least 3)"
            }]
          };
        }

        // Simple nearest-neighbor optimization
        const optimized = optimizeStops(stops);
        
        // Update with optimized order
        const response = await samsaraRequest(`/fleet/routes/${toolArgs.routeId}`, {
          method: 'PATCH',
          body: JSON.stringify({ stops: optimized })
        });
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              message: "Route optimized",
              originalOrder: stops.map((s: any, i: number) => `${i + 1}. ${s.name || s.address?.formattedAddress}`),
              optimizedOrder: optimized.map((s: any, i: number) => `${i + 1}. ${s.name || s.address?.formattedAddress}`),
              data: response
            }, null, 2)
          }]
        };
      }

      // ===== DRIVER TOOLS =====
      case "samsara_list_drivers": {
        const params = new URLSearchParams();
        params.set('limit', (toolArgs.limit || 50).toString());
        if (toolArgs.after) params.set('after', toolArgs.after);
        
        const response = await samsaraRequest(`/fleet/drivers?${params}`);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response, null, 2)
          }]
        };
      }

      case "samsara_get_driver": {
        const response = await samsaraRequest(`/fleet/drivers/${toolArgs.driverId}`);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response, null, 2)
          }]
        };
      }

      case "samsara_get_driver_hos": {
        const params = new URLSearchParams();
        params.set('startTime', toolArgs.startTime);
        params.set('endTime', toolArgs.endTime);
        
        const response = await samsaraRequest(`/fleet/drivers/${toolArgs.driverId}/hos-logs?${params}`);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response, null, 2)
          }]
        };
      }

      case "samsara_get_driver_safety_events": {
        const params = new URLSearchParams();
        params.set('startTime', toolArgs.startTime);
        params.set('endTime', toolArgs.endTime);
        
        const response = await samsaraRequest(`/fleet/drivers/${toolArgs.driverId}/safety/harsh-events?${params}`);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response, null, 2)
          }]
        };
      }

      // ===== ADDRESS TOOLS =====
      case "samsara_create_address": {
        const response = await samsaraRequest('/addresses', {
          method: 'POST',
          body: JSON.stringify(args)
        });
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response, null, 2)
          }]
        };
      }

      case "samsara_list_addresses": {
        const params = new URLSearchParams();
        params.set('limit', (toolArgs.limit || 50).toString());
        if (toolArgs.after) params.set('after', toolArgs.after);
        
        const response = await samsaraRequest(`/addresses?${params}`);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response, null, 2)
          }]
        };
      }

      // ===== WEBHOOK TOOLS =====
      case "samsara_create_webhook": {
        const response = await samsaraRequest('/webhooks', {
          method: 'POST',
          body: JSON.stringify(args)
        });
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response, null, 2)
          }]
        };
      }

      case "samsara_list_webhooks": {
        const response = await samsaraRequest('/webhooks');
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response, null, 2)
          }]
        };
      }

      case "samsara_delete_webhook": {
        await samsaraRequest(`/webhooks/${toolArgs.webhookId}`, { method: 'DELETE' });
        return {
          content: [{
            type: "text",
            text: `Webhook ${toolArgs.webhookId} deleted successfully`
          }]
        };
      }

      // ===== CONTACT TOOLS =====
      case "samsara_create_contact": {
        const response = await samsaraRequest('/contacts', {
          method: 'POST',
          body: JSON.stringify(args)
        });
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response, null, 2)
          }]
        };
      }

      case "samsara_list_contacts": {
        const params = new URLSearchParams();
        params.set('limit', (toolArgs.limit || 50).toString());
        
        const response = await samsaraRequest(`/contacts?${params}`);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response, null, 2)
          }]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: unknown) {
    return {
      content: [{
        type: "text",
        text: `Error: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
});

// Helper: Simple route optimization
function optimizeStops(stops: any[]): any[] {
  if (stops.length <= 2) return stops;
  
  const first = stops[0];
  const last = stops[stops.length - 1];
  const middle = stops.slice(1, -1);
  
  const optimized = [first];
  const remaining = [...middle];
  
  while (remaining.length > 0) {
    const current = optimized[optimized.length - 1];
    let nearest = remaining[0];
    let minDist = distance(current, nearest);
    
    for (const candidate of remaining.slice(1)) {
      const dist = distance(current, candidate);
      if (dist < minDist) {
        minDist = dist;
        nearest = candidate;
      }
    }
    
    optimized.push(nearest);
    remaining.splice(remaining.indexOf(nearest), 1);
  }
  
  optimized.push(last);
  return optimized;
}

function distance(a: any, b: any): number {
  const lat1 = a.address?.latitude;
  const lon1 = a.address?.longitude;
  const lat2 = b.address?.latitude;
  const lon2 = b.address?.longitude;
  
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
  
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a_calc = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a_calc), Math.sqrt(1 - a_calc));
  return R * c;
}

function toRad(deg: number): number {
  return deg * Math.PI / 180;
}

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Automation Squad - MCP for Samsara v1.0.0-beta.1 started");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
