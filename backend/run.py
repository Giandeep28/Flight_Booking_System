#!/usr/bin/env python3
"""
SkyVoyage Backend Server
Run the FastAPI application
"""

import uvicorn

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
