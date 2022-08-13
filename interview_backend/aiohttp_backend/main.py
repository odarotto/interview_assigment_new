import aiohttp_cors
from aiohttp import web
from routes import setup_routes

if __name__ == '__main__':
    # ----------------------------------------------------------------------------------------------
    # Create connection with database
    # ----------------------------------------------------------------------------------------------
    # Setup app
    # ----------------------------------------------------------------------------------------------
    app = web.Application()
    setup_routes(app)
    cors = aiohttp_cors.setup(app, defaults={
        "*": aiohttp_cors.ResourceOptions(
            allow_credentials=True,
            expose_headers='*',
            allow_headers='*'
        )
    })
    for route in app.router.routes():
        cors.add(route)
    web.run_app(app)
