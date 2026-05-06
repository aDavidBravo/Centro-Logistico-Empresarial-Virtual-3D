from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
import json
from datetime import datetime
from typing import List
import uvicorn

# ==================== CONNECTION MANAGER ====================
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"✓ Client connected. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        print(f"✗ Client disconnected. Total: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Error broadcasting: {e}")
                disconnected.append(connection)

        for conn in disconnected:
            self.disconnect(conn)


manager = ConnectionManager()

# ==================== MOCK DATA GENERATORS ====================
def generate_world_state():
    """Generate synthetic world state (similar to frontend generator)"""
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "sectors": {
            "inbound": {
                "occupancy_percent": 90,
                "capacity_used": 1515,
                "capacity_total": 1680,
                "status": "ok",
                "vehicle_count": 4
            },
            "storage": {
                "occupancy_percent": 78,
                "capacity_used": 2775,
                "capacity_total": 3136,
                "status": "ok",
                "sku_count": 6000,
                "rack_count": 192
            },
            "wip": {
                "occupancy_percent": 42,
                "orders_in_progress": 42,
                "preparation": 6,
                "production": 18,
                "status": "ok",
                "station_count": 8
            },
            "outbound": {
                "occupancy_percent": 87,
                "capacity_used": 1260,
                "capacity_total": 1456,
                "status": "warn",
                "vehicle_count": 5,
                "dock_count": 4
            },
            "transport": {
                "occupancy_percent": 65,
                "drone_count": 8,
                "van_count": 6,
                "status": "ok"
            }
        },
        "kpis": {
            "total_occupancy": 78,
            "inbound_occupancy": 90,
            "outbound_occupancy": 87,
            "wip_orders": 42
        },
        "alerts": [
            {
                "id": "alert_001",
                "level": "warn",
                "sector": "OUTBOUND",
                "message": "Dock 2 approaching capacity (87%)",
                "timestamp": datetime.utcnow().isoformat()
            },
            {
                "id": "alert_002",
                "level": "info",
                "sector": "TRANSPORT",
                "message": "Drone fleet: 8/8 active, delivery ETA 12min",
                "timestamp": datetime.utcnow().isoformat()
            }
        ]
    }


# ==================== STARTUP / SHUTDOWN ====================
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 CLEV3D Backend starting...")
    asyncio.create_task(broadcast_loop())
    yield
    # Shutdown
    print("🛑 CLEV3D Backend shutting down...")


# ==================== BROADCAST LOOP ====================
async def broadcast_loop():
    """Broadcast world state every 2 seconds"""
    while True:
        try:
            world_state = generate_world_state()
            await manager.broadcast({
                "type": "world_update",
                "data": world_state
            })
            await asyncio.sleep(2)
        except Exception as e:
            print(f"Error in broadcast loop: {e}")
            await asyncio.sleep(2)


# ==================== FASTAPI APP ====================
app = FastAPI(
    title="CLEV3D Backend",
    description="3D Digital Twin · Centro Logístico Empresarial Virtual",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== ROUTES ====================
@app.get("/")
async def root():
    return {
        "message": "CLEV3D Backend API",
        "version": "1.0.0",
        "status": "running",
        "ws_url": "ws://localhost:8000/ws/live"
    }


@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "connected_clients": len(manager.active_connections),
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/api/sectors")
async def get_sectors():
    """Get all sectors status"""
    state = generate_world_state()
    return state["sectors"]


@app.get("/api/kpis")
async def get_kpis():
    """Get KPI metrics"""
    state = generate_world_state()
    return state["kpis"]


@app.get("/api/alerts")
async def get_alerts():
    """Get active alerts"""
    state = generate_world_state()
    return state["alerts"]


# ==================== WEBSOCKET ====================
@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time world updates"""
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive by receiving heartbeats
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)


# ==================== RUN ====================
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
