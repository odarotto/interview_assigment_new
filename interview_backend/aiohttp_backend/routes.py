from views import *

def setup_routes(app):
    app.router.add_get('/assets', index_assets)
    app.router.add_get('/liabilities', index_liabilities)
    app.router.add_get('/search', search)
    app.router.add_get('/get_record', get_record)
    app.router.add_post('/add_asset', add_asset)
    app.router.add_post('/add_liability', add_liability)
    app.router.add_post('/update_record', update_record)
    app.router.add_delete('/delete', delete_record)
